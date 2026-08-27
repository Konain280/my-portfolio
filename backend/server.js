const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { db } = require("./database");
const { assertAuthConfig, login, verifyToken } = require("./auth");

const PORT = Number(process.env.PORT) || 5001;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

function createRateLimiter({ windowMs, limit, message }) {
  const attempts = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const current = attempts.get(key);

    if (!current || current.resetAt <= now) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > limit) {
      res.set("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
      return res.status(429).json({ success: false, message });
    }

    return next();
  };
}

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many login attempts. Please try again later.",
});

const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many messages sent. Please try again later.",
});

function requireAdmin(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Authentication required." });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ success: false, message: "Session expired or invalid." });
  }

  req.user = user;
  return next();
}

function parseContact(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) return { error: "Message rejected." };
  if (!name || !email || !message) return { error: "All fields are required." };
  if (/[\r\n]/.test(name)) return { error: "Name contains invalid characters." };
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return { error: "One or more fields are too long." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  return { value: { name, email, message } };
}

function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD || process.env.DISABLE_EMAIL === "true") {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
  });
}

function createApp() {
  assertAuthConfig();
  const app = express();
  const transporter = createTransporter();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    });
    next();
  });
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));
  app.use(express.json({ limit: "20kb" }));

  app.get("/", (req, res) => res.json({ success: true, message: "Portfolio API is running." }));
  app.get("/api/health", (req, res) => res.json({
    success: true,
    database: "connected",
    emailConfigured: Boolean(transporter),
  }));

  app.post("/api/contact", contactLimiter, async (req, res) => {
    const parsed = parseContact(req.body || {});
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    const { name, email, message } = parsed.value;
    try {
      const result = db.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)").run(name, email, message);
      let emailSent = false;

      if (transporter) {
        try {
          await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Portfolio Message from ${name}`,
            text: `You received a new portfolio message.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          });
          emailSent = true;
        } catch {
          console.error(`Email notification failed for contact ID ${result.lastInsertRowid}.`);
        }
      }

      return res.status(201).json({
        success: true,
        emailSent,
        message: emailSent
          ? "Your message was sent successfully."
          : "Your message was received successfully.",
      });
    } catch {
      console.error("Contact message could not be saved.");
      return res.status(500).json({ success: false, message: "Message could not be saved." });
    }
  });

  app.post("/api/login", loginLimiter, (req, res) => {
    const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    const token = login(username, password);
    if (!token) return res.status(401).json({ success: false, message: "Invalid username or password." });
    return res.json({ success: true, token });
  });

  app.get("/api/contact", requireAdmin, (req, res) => {
    try {
      const messages = db.prepare("SELECT * FROM contacts ORDER BY created_at DESC, id DESC").all();
      return res.json({ success: true, messages });
    } catch {
      return res.status(500).json({ success: false, message: "Messages could not be loaded." });
    }
  });

  app.patch("/api/contact/:id/read", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ success: false, message: "Invalid message ID." });
    const result = db.prepare("UPDATE contacts SET read_at = COALESCE(read_at, CURRENT_TIMESTAMP) WHERE id = ?").run(id);
    if (!result.changes) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true });
  });

  app.delete("/api/contact/:id", requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ success: false, message: "Invalid message ID." });
    const result = db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
    if (!result.changes) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true });
  });

  app.use((error, req, res, next) => {
    void req; void next;
    if (error?.message === "Origin is not allowed by CORS.") {
      return res.status(403).json({ success: false, message: "Origin is not allowed." });
    }
    if (error?.type === "entity.too.large") {
      return res.status(413).json({ success: false, message: "Request body is too large." });
    }
    if (error instanceof SyntaxError && error?.type === "entity.parse.failed") {
      return res.status(400).json({ success: false, message: "Request body must be valid JSON." });
    }
    console.error("Unexpected API error.");
    return res.status(500).json({ success: false, message: "An unexpected error occurred." });
  });

  return app;
}

function startServer() {
  const app = createApp();
  return app.listen(PORT, () => console.log(`Portfolio API listening on port ${PORT}.`));
}

if (require.main === module) startServer();

module.exports = { createApp, startServer };
