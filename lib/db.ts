import { Pool } from "pg"

/** Value accepted as a positional parameter in a parameterised SQL query. */
export type SqlValue = string | number | boolean | null | string[]

// Single database — DB1 (primary, full read/write)
export const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
})
