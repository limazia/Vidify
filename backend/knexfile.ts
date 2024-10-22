import type { Knex } from "knex";

import { env } from "@/env";

const database: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: env.DATABASE_URL,
    pool: {
      min: 2,
      max: 5,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: env.DATABASE_URL,
    pool: {
      min: 10,
      max: 50,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      loadExtensions: [".js", ".ts"],
      disableMigrationsListValidation: true,
    },
  },
};

export default database;
