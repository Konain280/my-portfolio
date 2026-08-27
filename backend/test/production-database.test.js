import assert from "node:assert/strict";
import test from "node:test";

test("production never falls back to ephemeral SQLite storage", async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousDatabaseUrl = process.env.DATABASE_URL;
  process.env.NODE_ENV = "production";
  delete process.env.DATABASE_URL;
  const { getDatabase } = await import(`../../api/_lib/database.js?production-check=${Date.now()}`);
  await assert.rejects(getDatabase(), /DATABASE_URL is required in production/);
  process.env.NODE_ENV = previousNodeEnv;
  if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = previousDatabaseUrl;
});
