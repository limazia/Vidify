import knex from "knex";

import { env } from "@/env";
import database from "knexfile";

export const connection = knex(database[env.NODE_ENV]);
