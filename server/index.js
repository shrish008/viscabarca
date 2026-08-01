import express from "express";
import cors from "cors";
import { insertLead, listLeads } from "./db.js";

const PORT = process.env.PORT || 3001;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const app = express();
app.use(cors({ origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",") }));
app.use(express.json({ limit: "256kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Every completed tool session, WhatsApp CTA click, and PDF export lands
// here — see src/lib/leads.ts on the frontend.
app.post("/api/leads", (req, res) => {
  const body = req.body || {};

  if (!body.id || !body.tool || !body.timestamp) {
    return res.status(400).json({ error: "id, tool, and timestamp are required" });
  }

  try {
    insertLead({
      id: String(body.id),
      created_at: String(body.timestamp),
      tool: String(body.tool),
      action: String(body.action || "session"),
      event_type: body.inputs?.eventType ? String(body.inputs.eventType) : null,
      name: body.name ? String(body.name) : null,
      whatsapp: body.whatsapp ? String(body.whatsapp) : null,
      email: body.email ? String(body.email) : null,
      source: body.source ? String(body.source) : null,
      result_summary: body.resultSummary ? String(body.resultSummary) : null,
      inputs_json: body.inputs ? JSON.stringify(body.inputs) : null,
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Failed to insert lead:", err);
    res.status(500).json({ error: "Failed to save lead" });
  }
});

// Simple admin listing, gated behind an API key so lead PII (name, phone,
// email) isn't publicly readable. Set ADMIN_API_KEY before deploying.
app.get("/api/leads", (req, res) => {
  if (ADMIN_API_KEY && req.header("x-api-key") !== ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const limit = Math.min(Number(req.query.limit) || 100, 500);
  const offset = Number(req.query.offset) || 0;
  res.json({ leads: listLeads({ limit, offset }) });
});

app.listen(PORT, () => {
  console.log(`Magical Realm leads API listening on http://localhost:${PORT}`);
  if (!ADMIN_API_KEY) {
    console.warn("ADMIN_API_KEY is not set — GET /api/leads is currently open to anyone. Set it before deploying.");
  }
});
