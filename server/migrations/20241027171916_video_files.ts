import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("video_files", (table: Knex.TableBuilder) => {
    table.uuid("id").primary().notNullable().unique();
    table.string("cover_url");
    table.string("video_url");
    table.integer("width");
    table.integer("height");
    table.string("size");
    table.string("type");

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
  return knex.schema.dropTable("video_files");
}
