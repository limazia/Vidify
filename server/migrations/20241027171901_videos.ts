import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("videos", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable().unique();
    table.string("prompt").notNullable();
    table.string("title");
    table.text("narration");
    table.string("tags");

    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("videos");
}
