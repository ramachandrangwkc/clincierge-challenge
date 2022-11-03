import { inject, injectable } from "inversify";
import Gift from "../../model/Gift";
import DAO from "../base-classes/DAO";

@injectable()
class GiftDAO extends DAO<Gift> {
  constructor(
    @inject("Gift")
    protected readonly _gift: typeof Gift
  ) {
    super(_gift);
  }
}

export default GiftDAO;
