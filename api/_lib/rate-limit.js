const stores = new Map();

export function enforceRateLimit(req, res, { name, windowMs, limit, message }) {
  const now = Date.now();
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const key = `${name}:${ip}`;
  const current = stores.get(key);
  if (!current || current.resetAt <= now) {
    stores.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  current.count += 1;
  if (current.count <= limit) return true;
  res.setHeader("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
  res.status(429).json({ success: false, message });
  return false;
}

export function resetRateLimitsForTests() {
  stores.clear();
}
