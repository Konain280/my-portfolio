const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const [, , username, password] = process.argv;

if (!username || !password || password.length < 12) {
  console.error("Usage: npm run setup:admin -- <username> <password-of-at-least-12-characters>");
  process.exit(1);
}

const envPath = path.join(__dirname, ".env");
const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const values = {
  ADMIN_USERNAME: username,
  ADMIN_PASSWORD_HASH: bcrypt.hashSync(password, 12),
  JWT_SECRET: crypto.randomBytes(48).toString("hex"),
};

let next = current;
for (const [key, value] of Object.entries(values)) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  next = pattern.test(next) ? next.replace(pattern, line) : `${next.trimEnd()}\n${line}\n`;
}

fs.writeFileSync(envPath, next.replace(/^\s+/, ""));
console.log("Admin credentials configured in backend/.env.");
