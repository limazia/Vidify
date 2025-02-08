import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("video_files", (table: Knex.TableBuilder) => {
    table.string("id").primary().notNullable().unique();
    table.string("cover_url").notNullable();
    table.string("video_url").notNullable();
    table.integer("width").notNullable();
    table.integer("height").notNullable();
    table.integer("size").notNullable();
    table.string("type").notNullable();
 
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
  return knex.schema.dropTable("video_files");
}
