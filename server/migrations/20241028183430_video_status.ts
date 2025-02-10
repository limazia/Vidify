import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("video_status", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable().unique();
    table
      .enu("state", ["pending", "processing", "failed", "finished"])
      .notNullable();
    table.string("message");
    
    table
      .uuid("video_id")
      .notNullable()
      .references("id")
      .inTable("videos")
      .onDelete("CASCADE");

    table.timestamp("updated_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    table.timestamp("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("video_status");
}
