import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "data");
mkdirSync(dataDir, { recursive: true });

export const db = new Database(join(dataDir, "leads.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    tool TEXT NOT NULL,
    action TEXT NOT NULL,
    event_type TEXT,
    name TEXT,
    whatsapp TEXT,
    email TEXT,
    source TEXT,
    result_summary TEXT,
    inputs_json TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
`);

export function insertLead(lead) {
  const stmt = db.prepare(`
    INSERT INTO leads (id, created_at, tool, action, event_type, name, whatsapp, email, source, result_summary, inputs_json)
    VALUES (@id, @created_at, @tool, @action, @event_type, @name, @whatsapp, @email, @source, @result_summary, @inputs_json)
    ON CONFLICT(id) DO NOTHING
  `);
  stmt.run(lead);
}

export function listLeads({ limit = 100, offset = 0 } = {}) {
  return db
    .prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT ? OFFSET ?")
    .all(limit, offset);
}
