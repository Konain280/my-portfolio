const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");

const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-api-test-"));
process.env.DATABASE_PATH = path.join(testDirectory, "test.db");
process.env.ADMIN_USERNAME = "audit-admin";
const testPassword = crypto.randomBytes(18).toString("hex");
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync(testPassword, 4);
process.env.JWT_SECRET = crypto.randomBytes(48).toString("hex");
process.env.CLIENT_ORIGIN = "http://localhost:5173";
process.env.DISABLE_EMAIL = "true";

const { createApp } = require("../server");
const { db } = require("../database");

test("portfolio API contact and admin workflow", async (context) => {
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    db.close();
    fs.rmSync(testDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  let response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{invalid-json",
  });
  assert.equal(response.status, 400);

  response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "", email: "invalid", message: "" }),
  });
  assert.equal(response.status, 400);

  response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "API Test", email: "test@example.com", message: "Temporary integration test." }),
  });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).emailSent, false);

  response = await fetch(`${baseUrl}/api/contact`);
  assert.equal(response.status, 401);

  response = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "audit-admin", password: "wrong-password" }),
  });
  assert.equal(response.status, 401);

  response = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "audit-admin", password: testPassword }),
  });
  assert.equal(response.status, 200);
  const { token } = await response.json();
  assert.ok(token);
  const headers = { Authorization: `Bearer ${token}` };

  response = await fetch(`${baseUrl}/api/contact`, { headers });
  assert.equal(response.status, 200);
  const inbox = await response.json();
  assert.equal(inbox.messages.length, 1);
  const id = inbox.messages[0].id;

  response = await fetch(`${baseUrl}/api/contact/${id}/read`, { method: "PATCH", headers });
  assert.equal(response.status, 200);

  response = await fetch(`${baseUrl}/api/contact/${id}`, { method: "DELETE", headers });
  assert.equal(response.status, 200);
});
