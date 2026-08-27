import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";

const [, , username, password] = process.argv;
if (!username || !password || password.length < 12) {
  console.error("Usage: npm run setup:admin -- <username> <password-of-at-least-12-characters>");
  process.exitCode = 1;
} else {
  const envPath = path.resolve(".env");
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const values = {
    ADMIN_USERNAME: username,
    ADMIN_PASSWORD_HASH: bcrypt.hashSync(password, 12),
    JWT_SECRET: crypto.randomBytes(48).toString("hex"),
  };
  const keys = new Set(Object.keys(values));
  const retained = existing.split(/\r?\n/).filter((line) => !keys.has(line.split("=")[0]));
  const output = [...retained.filter(Boolean), ...Object.entries(values).map(([key, value]) => `${key}=${value}`), ""].join("\n");
  fs.writeFileSync(envPath, output, { mode: 0o600 });
  console.log("Admin username, bcrypt password hash, and JWT secret were written to .env.");
}
