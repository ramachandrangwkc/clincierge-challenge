import "reflect-metadata";
import { Container } from "inversify";
// injections
import Customer from "./model/Customer";
import Pet from "./model/Pet";
import Gift from "./model/Gift";

import setupDb from "./db/db-setup";

setupDb();

const container = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
});

container.bind("Customer").toConstantValue(Customer);
container.bind("Pet").toConstantValue(Pet);
container.bind("Gift").toConstantValue(Gift);
export { container };
