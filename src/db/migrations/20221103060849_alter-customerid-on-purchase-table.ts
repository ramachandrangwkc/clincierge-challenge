import { Knex } from "knex";

export const up = (knex: Knex) => {
    return knex.schema.alterTable("purchases", (table) => {
        table.uuid('customerId').alter();
    });
};

export const down = (knex: Knex) =>
    knex.schema.alterTable("purchases", (table) => {
        table.string('customerId').alter();
    });
