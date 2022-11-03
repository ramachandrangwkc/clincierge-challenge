import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import Service from "../service/customers/CustomersService";
import ApiError from "../middleware/ApiError";

@injectable()
class CustomersController {
  constructor(private readonly _service: Service) {
    this.getAll = this.getAll.bind(this);
    this.getAllGifts = this.getAllGifts.bind(this);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._service.getAll();
      return res.status(200).json(result);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      next(ApiError.internal(message));
    }
  }

  /// <summary>
  /// Retrieve a gift object for the customer.
  /// </summary>
  /// <remarks>This method will check if the customer is inactive for more than 6 months. If so, returns a gift card as a promotional activity.</remarks>
  /// <response code="200">Returns Gift Object or Null</response>
  /// <response code="500">Error message</response>
  async getAllGifts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this._service.getAllGifts(req.params.customerId);
      return res.status(200).json(result);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      next(ApiError.internal(message));
    }
  }

}

export default CustomersController;
