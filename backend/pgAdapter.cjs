const { Pool } = require('pg');

function toPgParams(sql, params = []) {
  let index = 0;
  const transformed = sql.replace(/\?/g, () => `$${++index}`);
  return { sql: transformed, params };
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL not set. Please configure your Supabase Postgres connection string.');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

function run(sql, params = [], cb = () => {}) {
  const trimmed = sql.trim();
  const isInsert = /^insert\s+/i.test(trimmed);
  const hasReturning = /returning\s+id\b/i.test(trimmed);
  const isUpdateOrDelete = /^(update|delete)\s+/i.test(trimmed);
  const finalSql = isInsert && !hasReturning ? `${trimmed} RETURNING id` : trimmed;
  const { sql: text, params: values } = toPgParams(finalSql, params);
  pool.query(text, values)
    .then((result) => {
      const ctx = {
        lastID: isInsert ? (result.rows[0] ? result.rows[0].id : undefined) : undefined,
        changes: result.rowCount,
      };
      cb.call(ctx, null);
    })
    .catch((err) => cb.call({}, err));
}

function get(sql, params = [], cb = () => {}) {
  const { sql: text, params: values } = toPgParams(sql, params);
  pool.query(text, values)
    .then((result) => cb(null, result.rows[0]))
    .catch((err) => cb(err));
}

function all(sql, params = [], cb = () => {}) {
  const { sql: text, params: values } = toPgParams(sql, params);
  pool.query(text, values)
    .then((result) => cb(null, result.rows))
    .catch((err) => cb(err));
}

module.exports = { run, get, all, pool };
