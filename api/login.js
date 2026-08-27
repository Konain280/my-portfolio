import { login } from "./_lib/auth.js";
import { prepareRequest, handleError } from "./_lib/http.js";
import { enforceRateLimit } from "./_lib/rate-limit.js";

export default async function handler(req, res) {
  if (!prepareRequest(req, res, ["POST"])) return;
  if (!enforceRateLimit(req, res, { name: "login", windowMs: 15 * 60 * 1000, limit: 10, message: "Too many login attempts. Please try again later." })) return;
  const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!username || !password) return res.status(400).json({ success: false, message: "Username and password are required." });
  try {
    const token = await login(username, password);
    if (!token) return res.status(401).json({ success: false, message: "Invalid username or password." });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    return handleError(error, res, "Login is temporarily unavailable.");
  }
}
