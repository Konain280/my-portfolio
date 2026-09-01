import fs from "node:fs";

const requiredVariables = [
  "DATABASE_URL", "CLIENT_ORIGIN", "EMAIL_USER", "EMAIL_APP_PASSWORD",
  "ADMIN_USERNAME", "ADMIN_PASSWORD_HASH", "JWT_SECRET",
];
const documentedLocalVariables = ["SQLITE_DATABASE_PATH", "DISABLE_EMAIL", "PORT"];
const example = fs.readFileSync(".env.example", "utf8");
const missingVariables = [...requiredVariables, ...documentedLocalVariables]
  .filter((name) => !new RegExp(`^${name}=`, "m").test(example));
if (missingVariables.length) throw new Error(`.env.example is missing: ${missingVariables.join(", ")}`);

const config = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
if (config.framework !== "vite" || config.outputDirectory !== "dist") throw new Error("vercel.json does not describe the Vite production output.");
if (config.buildCommand !== "npm run build") throw new Error("vercel.json must run the production Vite build.");
const requiredDynamicRewrites = [
  ["/api/contact/:id/read", "/api/contact/[id]/read"],
  ["/api/contact/:id", "/api/contact/[id]"],
];
for (const [source, destination] of requiredDynamicRewrites) {
  if (!config.rewrites?.some((rewrite) => rewrite.source === source && rewrite.destination === destination)) {
    throw new Error(`vercel.json is missing the dynamic API rewrite from ${source} to ${destination}.`);
  }
}
if (!config.rewrites?.some(({ source, destination }) => source === "/(.*)" && destination === "/index.html")) {
  throw new Error("vercel.json must preserve direct navigation to the React admin route.");
}
if (!fs.existsSync("api/health.js") || !fs.existsSync("api/contact/index.js")) throw new Error("Required Vercel API functions are missing.");
if (!fs.existsSync("api/contact/[id].js") || !fs.existsSync("api/contact/[id]/read.js")) throw new Error("Dynamic contact API functions are missing.");
if (fs.existsSync("render.yaml")) throw new Error("Render configuration must not remain in the Vercel-only project.");
console.log("Production configuration check passed.");
