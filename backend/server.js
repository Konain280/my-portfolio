import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import healthHandler from "../api/health.js";
import loginHandler from "../api/login.js";
import contactHandler from "../api/contact/index.js";
import contactIdHandler from "../api/contact/[id].js";
import contactReadHandler from "../api/contact/[id]/read.js";

dotenv.config({ path: path.resolve(".env") });
dotenv.config({ path: path.resolve("backend/.env") });

const port = Number(process.env.PORT) || 5001;

function routeRequest(req) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  req.query = Object.fromEntries(url.searchParams);
  if (url.pathname === "/api/health") return healthHandler;
  if (url.pathname === "/api/login") return loginHandler;
  if (url.pathname === "/api/contact") return contactHandler;
  if (url.pathname === "/api/contact/read") return contactReadHandler;
  if (url.pathname === "/api/contact/delete") return contactIdHandler;
  let match = url.pathname.match(/^\/api\/contact\/(\d+)\/read$/);
  if (match) { req.query.id = match[1]; return contactReadHandler; }
  match = url.pathname.match(/^\/api\/contact\/(\d+)$/);
  if (match) { req.query.id = match[1]; return contactIdHandler; }
  return null;
}

function addResponseHelpers(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (value) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(value));
  };
}

async function readBody(req) {
  if (!["POST", "PATCH", "PUT"].includes(req.method)) return undefined;
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 20 * 1024) throw Object.assign(new Error("Request body is too large."), { status: 413 });
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw Object.assign(new Error("Request body must be valid JSON."), { status: 400 }); }
}

export function createServer() {
  return http.createServer(async (req, res) => {
    addResponseHelpers(res);
    const handler = routeRequest(req);
    if (!handler) return res.status(404).json({ success: false, message: "API endpoint not found." });
    try {
      req.body = await readBody(req);
      await handler(req, res);
    } catch (error) {
      if (!res.headersSent) res.status(error.status || 500).json({ success: false, message: error.status ? error.message : "An unexpected error occurred." });
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  createServer().listen(port, "127.0.0.1", () => console.log(`Portfolio API listening on http://127.0.0.1:${port}.`));
}
