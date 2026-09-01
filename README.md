# Konain Tahir — Full-Stack Portfolio

A responsive React portfolio deployed as one Vercel project. Vite builds the frontend, Vercel Node.js Functions provide the API, Neon Serverless Postgres stores contact messages, and Gmail sends notifications.

## Architecture

- Frontend: React 19 and Vite 8, served from `dist/`
- API: Vercel Node.js Functions in `api/`
- Production database: Neon Serverless Postgres through the Vercel Marketplace
- Local/test database: SQLite through `better-sqlite3`
- Authentication: bcrypt admin password verification and two-hour JWT sessions
- Email: Nodemailer with a Gmail App Password

The frontend and API use the same Vercel origin. Browser requests use `/api/...`; no API hostname or secret is compiled into the frontend.

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Database, authentication configuration, and email status |
| `/api/contact` | POST | Validate and save a contact message, then notify by email |
| `/api/login` | POST | Authenticate the administrator and issue a JWT |
| `/api/contact` | GET | Return messages to an authenticated administrator |
| `/api/contact/read?id=:id` | PATCH | Mark a message as read |
| `/api/contact/delete?id=:id` | DELETE | Delete a message |

## Install and verify

Requirements: Node.js 22.12 or newer and npm.

```powershell
Set-Location "C:\Users\Fine Traders\Desktop\portfolio\my-portfolio"
npm.cmd install
npm.cmd run check
```

`npm run check` runs ESLint, the Vite production build, API syntax/configuration checks, SQLite database tests, authentication tests, contact tests, and admin workflow tests.

## Environment variables

Copy `.env.example` to `.env` for local API development. `.env` is ignored by Git.

| Variable | Production | Visibility | Purpose |
|---|---|---|---|
| `DATABASE_URL` | Required | Secret | Neon pooled PostgreSQL connection string; normally injected by the Vercel Neon integration |
| `CLIENT_ORIGIN` | Recommended | Normal | Exact public site origin, such as `https://example.com`; comma-separated origins are supported |
| `EMAIL_USER` | Required for notifications | Normal | Gmail address used to send and receive notifications |
| `EMAIL_APP_PASSWORD` | Required for notifications | Secret | Gmail App Password, never the normal Google password |
| `ADMIN_USERNAME` | Required | Normal | Private admin inbox username |
| `ADMIN_PASSWORD_HASH` | Required | Secret | Bcrypt hash, not a plaintext password |
| `JWT_SECRET` | Required | Secret | Cryptographically random secret of at least 32 characters |
| `SQLITE_DATABASE_PATH` | Local only | Normal | Optional path for the local SQLite file |
| `DISABLE_EMAIL` | Local/test only | Normal | Set to `true` to suppress real email during development or tests |
| `PORT` | Local only | Normal | Local API port; defaults to `5001` |

Do not prefix backend variables with `VITE_`. Vite variables are public in browser bundles.

## Create secure admin values

Use a private username and a unique password of at least 12 characters:

```powershell
Set-Location "C:\Users\Fine Traders\Desktop\portfolio\my-portfolio"
npm.cmd run setup:admin -- your-private-username "your-unique-admin-password"
```

This writes `ADMIN_USERNAME`, a bcrypt `ADMIN_PASSWORD_HASH`, and a random `JWT_SECRET` to the ignored root `.env`. It never saves the plaintext password. Copy the generated values into Vercel's encrypted environment variables.

## Local development

Without `DATABASE_URL`, the API automatically uses ignored local SQLite storage.

Terminal 1:

```powershell
Set-Location "C:\Users\Fine Traders\Desktop\portfolio\my-portfolio"
npm.cmd run dev:api
```

Terminal 2:

```powershell
Set-Location "C:\Users\Fine Traders\Desktop\portfolio\my-portfolio"
npm.cmd run dev
```

- Portfolio: `http://localhost:5173`
- Admin inbox: `http://localhost:5173/admin`
- API health: `http://localhost:5001/api/health`

Vite proxies `/api` to the local API. Production uses same-origin Vercel Functions and does not need `VITE_API_URL`.

## Vercel-only deployment

### 1. Import the existing GitHub repository

In Vercel, choose **Add New → Project**, import `Konain280/my-portfolio`, and keep the repository root as the Root Directory. Vercel reads `vercel.json`; the framework is Vite, build command is `npm run build`, and output directory is `dist`.

### 2. Create and connect Neon Postgres

In the Vercel project, open **Storage/Marketplace**, install **Neon**, create a Postgres database in a region near the Vercel functions, and connect it to this project for Production and Preview. The integration supplies `DATABASE_URL`. Do not paste it into source files.

No manual SQL migration is required for a new database. The API safely creates the `contacts` table with `CREATE TABLE IF NOT EXISTS` when it first connects.

### 3. Add server environment variables

In **Project Settings → Environment Variables**, add the following for Production and Preview:

```text
CLIENT_ORIGIN=https://your-production-domain.vercel.app
EMAIL_USER=your-gmail-address
EMAIL_APP_PASSWORD=your-new-gmail-app-password
ADMIN_USERNAME=your-private-admin-username
ADMIN_PASSWORD_HASH=your-generated-bcrypt-hash
JWT_SECRET=your-generated-random-secret
```

`DATABASE_URL` should already be supplied by Neon. Do not add `SQLITE_DATABASE_PATH`, `DISABLE_EMAIL`, `PORT`, or any `VITE_API_URL` in Vercel.

For the first preview deployment, Vercel automatically allows the current `VERCEL_URL`. `CLIENT_ORIGIN` is still recommended for the stable production/custom domain.

### 4. Deploy and verify

Trigger a deployment from the Vercel dashboard or push a new commit. Then verify:

1. Open `/api/health` and confirm `success: true`, `databaseType: "postgresql"`, and `emailConfigured: true`.
2. Submit a real message through the contact form and confirm it appears in Neon and arrives by email.
3. Open `/admin`, sign in, refresh the inbox, mark the test message read, and delete it.
4. Verify `/admin` opens directly, the CV downloads, and the profile image and favicon load.

If a custom domain is added later, update `CLIENT_ORIGIN` to that exact HTTPS origin and redeploy.

## Security and persistence

- Secrets exist only in server-side environment variables.
- `.env`, SQLite files, `node_modules`, `dist`, logs, and coverage are ignored.
- Production refuses to fall back to SQLite if `DATABASE_URL` is absent.
- Queries use parameterized Neon SQL templates.
- Admin endpoints require a correctly issued Bearer JWT.
- API responses use no-store and browser security headers.
- CORS permits configured, current Vercel preview, production, and localhost origins.
- Contact input has server validation, a honeypot, a 20 KB limit, and best-effort per-instance rate limiting.
- Gmail failure does not discard a saved contact message.

Vercel Functions and Neon are documented at:

- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/marketplace-storage
- https://neon.com/docs/serverless/serverless-driver
