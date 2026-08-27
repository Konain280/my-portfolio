const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

function assertAuthConfig() {
  const missing = [
    ["ADMIN_USERNAME", ADMIN_USERNAME],
    ["ADMIN_PASSWORD_HASH", ADMIN_PASSWORD_HASH],
    ["JWT_SECRET", JWT_SECRET],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing authentication configuration: ${missing.join(", ")}`);
  }

  if (!/^\$2[aby]\$\d{2}\$/.test(ADMIN_PASSWORD_HASH)) {
    throw new Error("ADMIN_PASSWORD_HASH must be a valid bcrypt hash.");
  }

  if (JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters.");
  }
}

// Login function
function login(username, password) {
  assertAuthConfig();

  // Check username
  if (username !== ADMIN_USERNAME) {
    return null;
  }

  // Compare password
  const passwordCorrect = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

  // Wrong password
  if (!passwordCorrect) {
    return null;
  }

  // Create JWT token
  const token = jwt.sign(
    {
      username: ADMIN_USERNAME,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
      issuer: "konain-portfolio-api",
      audience: "konain-portfolio-admin",
    }
  );

  return token;
}

// Verify JWT token
function verifyToken(token) {
  try {
    assertAuthConfig();
    return jwt.verify(token, JWT_SECRET, {
      issuer: "konain-portfolio-api",
      audience: "konain-portfolio-admin",
    });
  } catch {
    return null;
  }
}

module.exports = {
  assertAuthConfig,
  login,
  verifyToken,
};
