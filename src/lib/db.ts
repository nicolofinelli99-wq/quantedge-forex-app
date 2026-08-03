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
  });
}

// Reuse a single connection pool across hot reloads / serverless invocations.
export const sql = global.__quantedge_sql ?? makeClient();
if (process.env.NODE_ENV !== "production") {
  global.__quantedge_sql = sql;
}
