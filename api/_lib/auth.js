import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getAuthConfig() {
  const config = {
    username: process.env.ADMIN_USERNAME,
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
    jwtSecret: process.env.JWT_SECRET,
  };
  const missing = Object.entries(config).filter(([, value]) => !value).map(([name]) => name);
  if (missing.length) throw new Error(`Missing authentication configuration: ${missing.join(", ")}`);
  if (!/^\$2[aby]\$\d{2}\$/.test(config.passwordHash)) throw new Error("ADMIN_PASSWORD_HASH must be a valid bcrypt hash.");
  if (config.jwtSecret.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters.");
  return config;
}

export async function login(username, password) {
  const config = getAuthConfig();
  if (username !== config.username || !(await bcrypt.compare(password, config.passwordHash))) return null;
  return jwt.sign({ username: config.username }, config.jwtSecret, {
    expiresIn: "2h",
    issuer: "konain-portfolio-api",
    audience: "konain-portfolio-admin",
  });
}

export function verifyToken(token) {
  try {
    const config = getAuthConfig();
    return jwt.verify(token, config.jwtSecret, {
      issuer: "konain-portfolio-api",
      audience: "konain-portfolio-admin",
    });
  } catch {
    return null;
  }
}

export function assertAuthConfig() {
  getAuthConfig();
}
