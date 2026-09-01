import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-api-test-"));
process.env.NODE_ENV = "test";
process.env.SQLITE_DATABASE_PATH = path.join(testDirectory, "test.db");
process.env.ADMIN_USERNAME = "audit-admin";
const testPassword = crypto.randomBytes(18).toString("hex");
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(testPassword, 4);
process.env.JWT_SECRET = crypto.randomBytes(48).toString("hex");
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.DISABLE_EMAIL = "true";
delete process.env.DATABASE_URL;

const { createServer } = await import("../server.js");
const { getDatabase, resetDatabaseForTests } = await import("../../api/_lib/database.js");
const { resetRateLimitsForTests } = await import("../../api/_lib/rate-limit.js");

test("SQLite development database implements the persistent contact store", async () => {
  const database = await getDatabase();
  assert.equal(database.type, "sqlite");
  await database.health();
  const id = await database.createContact({ name: "Database Test", email: "db@example.com", message: "Database adapter test." });
  assert.equal((await database.listContacts())[0].id, id);
  assert.equal(await database.markContactRead(id), true);
  assert.ok((await database.listContacts())[0].read_at);
  assert.equal(await database.deleteContact(id), true);
  assert.equal(await database.deleteContact(id), false);
});

test("serverless contact, authentication, and admin endpoints work end to end", async (context) => {
  resetRateLimitsForTests();
  const server = createServer().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(async () => new Promise((resolve) => server.close(resolve)));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  let response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).databaseType, "sqlite");

  response = await fetch(`${baseUrl}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{invalid-json" });
  assert.equal(response.status, 400);
  response = await fetch(`${baseUrl}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "", email: "invalid", message: "" }) });
  assert.equal(response.status, 400);
  response = await fetch(`${baseUrl}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "API Test", email: "test@example.com", message: "Temporary integration test.", website: "" }) });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).emailSent, false);

  response = await fetch(`${baseUrl}/api/contact`);
  assert.equal(response.status, 401);
  const expiredToken = jwt.sign({ username: "audit-admin" }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: -1,
    issuer: "konain-portfolio-api",
    audience: "konain-portfolio-admin",
  });
  response = await fetch(`${baseUrl}/api/contact`, { headers: { Authorization: `Bearer ${expiredToken}` } });
  assert.equal(response.status, 401);
  response = await fetch(`${baseUrl}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "audit-admin", password: "wrong-password" }) });
  assert.equal(response.status, 401);
  response = await fetch(`${baseUrl}/api/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "audit-admin", password: testPassword }) });
  assert.equal(response.status, 200);
  const { token } = await response.json();
  const headers = { Authorization: `Bearer ${token}` };
  response = await fetch(`${baseUrl}/api/contact`, { headers });
  assert.equal(response.status, 200);
  const messages = (await response.json()).messages;
  const message = messages.find((item) => item.email === "test@example.com");
  assert.ok(message);
  response = await fetch(`${baseUrl}/api/contact/read?id=${message.id}`, { method: "PATCH", headers });
  assert.equal(response.status, 200);
  response = await fetch(`${baseUrl}/api/contact/delete?id=${message.id}`, { method: "DELETE", headers });
  assert.equal(response.status, 200);
  response = await fetch(`${baseUrl}/api/contact/delete?id=${message.id}`, { method: "DELETE", headers });
  assert.equal(response.status, 404);
  response = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://evil.example" } });
  assert.equal(response.status, 403);
  response = await fetch(`${baseUrl}/api/health`, { method: "OPTIONS", headers: { Origin: "http://localhost:5173" } });
  assert.equal(response.status, 204);
});

test.after(async () => {
  await resetDatabaseForTests();
  fs.rmSync(testDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
});
