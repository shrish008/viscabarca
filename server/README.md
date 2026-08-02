# Magical Realm leads API

A minimal Express + SQLite backend that persists every completed tool
session, WhatsApp CTA click, and PDF export as a row in a `leads` table —
see `src/lib/leads.ts` in the frontend for what gets sent.

## Run locally

```bash
cd server
npm install
cp .env.example .env   # optional — fill in ADMIN_API_KEY before deploying
npm start               # http://localhost:3001
```

Then point the frontend at it by setting `VITE_API_BASE_URL=http://localhost:3001`
in the frontend's `.env.local` (see the root `.env.example`) and restart `npm run dev`.

Without `VITE_API_BASE_URL` set, the frontend simply skips this API and
leads stay in the browser's local storage (and the optional webhook, if
configured) — nothing breaks, the database just doesn't get the data.

## API

- `POST /api/leads` — body is the `Lead` JSON shape from the frontend
  (`id`, `timestamp`, `tool`, `action`, `inputs`, `resultSummary`, `name`,
  `whatsapp`, `email`, `source`). Upserts by `id` (idempotent — a retried
  request won't double-insert).
- `GET /api/leads?limit=100&offset=0` — lists leads, newest first. Gated
  behind the `x-api-key` header matching `ADMIN_API_KEY` once that's set;
  wide open if it isn't (fine for local dev, not for production).
- `GET /api/health` — liveness check.

## Data

SQLite file at `server/data/leads.db` (WAL mode), created automatically on
first run. This is real, gitignored, PII — back it up like you would any
customer database, and don't commit it.

## Deploying

This is a plain, stateful Node process — it needs a host that keeps a
persistent filesystem and a long-running process (Railway, Render, Fly.io,
a small VPS, etc.), not a stateless serverless function (SQLite's file
would be wiped between invocations there). If your platform is
serverless-only, swap `better-sqlite3` for a hosted Postgres/MySQL client
and adjust `db.js` — the rest of the API surface can stay the same.

Before going live:
- Set `ADMIN_API_KEY` to something real.
- Set `CORS_ORIGIN` to your actual frontend domain (not `*`).
- Point the frontend's `VITE_API_BASE_URL` at this server's public URL.
