import { Pool } from "pg";

// Single database — DB1 (primary, full read/write)
export const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});
