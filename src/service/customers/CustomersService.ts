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
  /**
   * 
   * @param customerId The customer Id to check the gift eligibility
   * @returns Returns a object of type Gift to the controller if the customer is eligible
   * If not Eligible, it returns a null.
   * It also returns a ApiError.notFound issue if the customer id is not valid.
   */
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
