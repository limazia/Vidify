import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("chat", (table: Knex.TableBuilder) => {
    table.string("id").primary().notNullable().unique();
    table.string("term").notNullable();
    table
      .string("id_video")
      .notNullable()
      .references("id")
      .inTable("videos")
      .onDelete("CASCADE");

    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("chat");
}
