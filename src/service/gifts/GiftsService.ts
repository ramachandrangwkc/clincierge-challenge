import { injectable } from "inversify";
import Service from "../base-classes/Service";
import Gift from "../../model/Gift";
import GiftDAO from "../../dao/gifts/GiftsDAO";

@injectable()
class GiftsService extends Service<Gift> {
  constructor(protected readonly _giftsDAO: GiftDAO) {
    super(_giftsDAO);
  }
}

export default GiftsService;
