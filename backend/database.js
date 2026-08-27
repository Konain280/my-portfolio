const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const configuredPath = process.env.DATABASE_PATH;
const databasePath = configuredPath
  ? path.resolve(configuredPath)
  : path.join(__dirname, "portfolio.db");

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME
  )
`);

const columns = db.pragma("table_info(contacts)");
if (!columns.some((column) => column.name === "read_at")) {
  db.exec("ALTER TABLE contacts ADD COLUMN read_at DATETIME");
}

module.exports = { db, databasePath };
