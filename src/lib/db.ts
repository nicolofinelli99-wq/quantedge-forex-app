import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __quantedge_sql: ReturnType<typeof postgres> | undefined;
}

function makeClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return postgres(url, {
    ssl: "require",
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    // Vercel's DATABASE_URL runs through a connection pooler (PgBouncer-style,
    // Neon-backed). Server-side prepared statements don't play well with that:
    // if we run an ALTER TABLE (via ensureSchema()) and a pooled session later
    // reuses a plan prepared before the change, Postgres throws "cached plan
    // must not change result type" and every query on that route starts
    // 500ing. Disabling prepared statements avoids this entirely — this is
    // the standard fix recommended for postgres.js behind a pooler.
    prepare: false,
  });
}

// Reuse a single connection pool across hot reloads / serverless invocations.
export const sql = global.__quantedge_sql ?? makeClient();
if (process.env.NODE_ENV !== "production") {
  global.__quantedge_sql = sql;
}
