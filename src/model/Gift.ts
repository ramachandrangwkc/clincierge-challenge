import { Model } from "objection";
import Customer from "./Customer";
import Pet from "./Pet";

class Gift extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "gifts";
  }

  // Optional JSON schema. This is not the database schema!
  // No tables or columns are generated based on this. This is only
  // used for input validation. Whenever a model instance is created
  // either explicitly or implicitly it is checked against this schema.
  // See http://json-schema.org/ for more info.
  static get jsonSchema() {
    return {
      type: "object",
      required: ["customerId", "petId"],
      properties: {
        id: { type: "string" },
        customerId: { type: "string" },
        petId: { type: "string" },
        species: { type: "string" },
        message: { type: "string" }
      },
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      customers: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: "gifts.customerId",
          to: "customers.id",
        },
      },
      pets: {
        relation: Model.BelongsToOneRelation,
        modelClass: Pet,
        join: {
          from: "gifts.petId",
          to: "pets.id",
        },
      },
    };
  }
}

export default Gift;
