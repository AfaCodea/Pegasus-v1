import { Pool, QueryResultRow, types } from 'pg';

// Return DATE columns (OID 1082) as plain 'YYYY-MM-DD' strings instead of
// JS Date objects, so JSON serialization never shifts the day across timezones.
types.setTypeParser(1082, (value) => value);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const result = await pool.query<T>(text, params);
  return result;
}
