const allowedMethods = "GET, POST, PATCH, DELETE, OPTIONS";

export function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cache-Control", "no-store");
}

export function allowRequestOrigin(req, res) {
  const origin = req.headers.origin;
  const configured = (process.env.CLIENT_ORIGIN || "")
    .split(",").map((value) => value.trim().replace(/\/$/, "")).filter(Boolean);
  const vercelOrigins = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
    .filter(Boolean).map((host) => `https://${host.replace(/^https?:\/\//, "").replace(/\/$/, "")}`);
  const localOrigins = process.env.NODE_ENV === "production" ? [] : ["http://localhost:5173"];
  const allowed = new Set([...configured, ...vercelOrigins, ...localOrigins]);

  if (origin && !allowed.has(origin.replace(/\/$/, ""))) {
    res.status(403).json({ success: false, message: "Origin is not allowed." });
    return false;
  }
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", allowedMethods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }
  return true;
}

export function prepareRequest(req, res, methods) {
  setSecurityHeaders(res);
  if (!allowRequestOrigin(req, res)) return false;
  if (!methods.includes(req.method)) {
    res.setHeader("Allow", [...methods, "OPTIONS"].join(", "));
    res.status(405).json({ success: false, message: "Method not allowed." });
    return false;
  }
  return true;
}

export function requireAdmin(req, res, verifyToken) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  const user = scheme === "Bearer" && token ? verifyToken(token) : null;
  if (!user) {
    res.status(401).json({ success: false, message: "Authentication required or session expired." });
    return null;
  }
  return user;
}

export function handleError(error, res, publicMessage) {
  console.error(error instanceof Error ? error.message : "Unexpected API error.");
  if (!res.headersSent) res.status(500).json({ success: false, message: publicMessage });
}
