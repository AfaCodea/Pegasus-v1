import fs from 'fs';
import path from 'path';
import { pool } from '../../db/pool';

const schemaPath = path.join(__dirname, '..', '..', 'db', 'schema.sql');

/** Apply the schema (idempotent) — run once before the suite. */
export async function applySchema() {
  const sql = fs.readFileSync(schemaPath, 'utf-8');
  await pool.query(sql);
}

/** Wipe all data between tests, resetting identity sequences. */
export async function resetTables() {
  await pool.query('TRUNCATE TABLE tasks, users RESTART IDENTITY CASCADE');
}

/** Close the shared pool so Jest can exit cleanly. */
export async function closePool() {
  await pool.end();
}
