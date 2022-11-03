import { Knex } from "knex";

export const up = async (knex: Knex) => {
  await knex.schema.createTable("gifts", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("customerId");
    table.string("petId");
    table.string("species").nullable();
    table.string("message").nullable();
    table.timestamps(true, true);
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTable("gifts");
};
