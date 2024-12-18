import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema";
export * from "./db";

export const db = drizzle(sql, { schema });
