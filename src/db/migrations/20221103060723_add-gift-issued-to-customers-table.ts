import { Knex } from "knex";

export const up = (knex: Knex) => {
  return knex.schema.alterTable("customers", (table) => {
    table.boolean("isGiftIssued").notNullable().defaultTo(0);
  });
};

export const down = (knex: Knex) =>
  knex.schema.alterTable("customers", (table) => {
    table.dropColumn("isGiftIssued");
  });
