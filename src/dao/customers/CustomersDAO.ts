// we should not need to import "reflect-metadata" here, 
// but there is a bug which requires it.
import "reflect-metadata";
import { inject, injectable } from "inversify";
import Customer from "../../model/Customer";
import DAO from "../base-classes/DAO";
import { raw } from "objection";

@injectable()
class CustomersDAO extends DAO<Customer> {

  constructor(
    @inject("Customer")
    protected readonly _customer: typeof Customer
  ) {
    super(_customer);
  }

  /**
   * 
   * @param id The customer Id.
   * @param historyInMonths The number of months to check the history of purchase
   * @returns A objection object of type CustomerPurchaseHistoryType.
   */
  getCustomerWithPurchaseHistory(id: string, historyInMonths: number = 6) {
    let date = new Date();
    date.setMonth(date.getMonth() - historyInMonths);
    return this._customer.query()
      .findById(id)
      .select("customers.isGiftIssued", raw("JSON_AGG(pets.*)").as("pets"), [Customer.relatedQuery('purchases').count("id").as('totalPurchases').where("date", ">=", date.toISOString())])
      .joinRelated({ pets: true })
      .groupBy("customers.id")
      .groupBy("customers.isGiftIssued")
  }

}

export default CustomersDAO;
