import { inject, injectable } from "inversify";
import Service from "../base-classes/Service";
import CustomersDAO from "../../dao/customers/CustomersDAO";
import Customer, { CustomerPurchaseHistoryType } from "../../model/Customer";
import GiftsService from "../gifts/GiftsService";
import ApiError from "../../middleware/ApiError";



@injectable()
class CustomersService extends Service<Customer> {
  constructor(protected readonly _customersDAO: CustomersDAO, @inject(GiftsService) private readonly _giftService: GiftsService) {
    super(_customersDAO);
  }
  /// <summary>
  /// Retrieve a gift object for the customer.
  /// </summary>
  /// <remarks>This method will check if the customer is inactive for more than 6 months. If so, returns a gift card as a promotional activity.</remarks>
  /// <response code="200">Returns Gift Object or Null</response>
  /// <response code="500">Oops! Can't create your product right now</response>
  getAllGifts(customerId: string) {
    return new Promise(async (resolve, reject) => {
      const trx = await Customer.startTransaction();
      try {
        let customer = await this._customersDAO.getCustomerWithPurchaseHistory(customerId, 6);
        if (customer) {
          const parsedCustomer = customer.toJSON() as CustomerPurchaseHistoryType;

          //If Gift already issued.
          if (parsedCustomer.isGiftIssued) {
            console.log("No Gift due to already issued.")
            return resolve(null);
          } else if (parsedCustomer.totalPurchases > 0) {
            console.log(`No Gift due to ${parsedCustomer.totalPurchases} purchases.`)
            return resolve(null);
          } else {
            console.log("Issue gift")
            const randomPet = parsedCustomer.pets[Math.floor(Math.random() * parsedCustomer.pets.length)];
            //Create a gift.
            const gift = await this._giftService.insert({ customerId, petId: randomPet.id, species: randomPet.species, message: `${randomPet.species} Gift` })
            await this._customersDAO.patchAndFetchById(customerId, { isGiftIssued: true });
            await trx.commit()
            resolve(gift)
          }
        } else {
          await trx.rollback();
          return reject(ApiError.notFound("Customer not found"));
        }

      } catch (e) {
        await trx.rollback();
        return reject(e);
      }
    });
  }
}

export default CustomersService;
