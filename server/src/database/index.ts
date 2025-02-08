import knex from "knex";

import { env } from "@/shared/config/env";
import database from "knexfile";

export const connection = knex(database[env.NODE_ENV]);
