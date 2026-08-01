# Magical Realm — AI Event Portal

A mobile-first, single-URL lead-generation portal for Magical Realm (premium
wedding & event decor, Chennai). One link for the Instagram bio, three
connected tools, one goal: turn visitors into booking enquiries on WhatsApp.

- **Event Budget Planner** — deterministic itemized breakdown + "will it
  cover it?" verdict, with live-rebalancing sliders.
- **Dress Code Planner** — coordinated outfit & colour suggestions by group
  and vibe.
- **Decor & Stage Planner** — collects theme/palette/free-text and builds the
  image-generation prompt described in the brief. Ships with a curated
  concept-preview gallery (no photorealistic AI renders) because no
  image-generation API key is configured yet — see below before enabling it.

Every result screen ends with a WhatsApp CTA that pre-fills the visitor's
result into the outbound message, and every completed tool session is logged
as a lead (see `src/lib/leads.ts`) before or at the point the visitor sees
their result.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

## Before going live

1. **WhatsApp number** — set `VITE_WHATSAPP_NUMBER` (see `.env.example`).
   The current default (`910000000000`) is a placeholder and will not work.
2. **Lead delivery** — leads are always saved to the browser's local storage
   as a safety net, and the outbound WhatsApp message always carries the
   full result, so no lead is silently lost. For a durable, team-visible
   record, set `VITE_LEAD_WEBHOOK_URL` to a Google Sheet / CRM / Zapier
   webhook — every completed session POSTs there automatically
   (`src/lib/leads.ts`).
3. **"Why Magical Realm" trust strip** (`src/pages/Home.tsx`) currently uses
   text cards, not real photos — swap in real event photography per the
   brand brief.
4. **Decor & Stage Planner image generation** — per the build brief, this is
   intentionally shipped last and only with a curated preset/concept
   fallback (`src/lib/decor.ts`, `src/components/DecorConceptCard.tsx`).
   Do not expose real AI-generated renders until they've been validated as
   genuinely premium: wire in an image API (fal.ai / Replicate / Imagen)
   behind a server-side call (never call it with a secret key directly from
   the browser), keep the existing graceful fallback to the concept gallery,
   and rate-limit/cache generations to control cost.
5. **Brand palette / fonts** — tokens live in `src/index.css` (`@theme`
   block) and match the brief's berry/rose/gold/cream palette with
   Playfair Display + Inter. Swap for final brand assets if they differ.

## Structure

- `src/context/EventContext.tsx` — cross-tool event state (event type, guest
  count, city, budget, palette) held in memory and shared across all three
  tools, so completing one pre-fills the others.
- `src/lib/budget.ts`, `src/lib/dressCode.ts`, `src/lib/decor.ts` —
  deterministic domain logic per module, kept separate from UI.
- `src/lib/leads.ts`, `src/lib/whatsapp.ts` — the lead-capture + WhatsApp CTA
  plumbing shared by all three result screens.
- `src/pages/*` — one screen per tool (`Home`, `BudgetPlanner`,
  `DressCodePlanner`, `DecorPlanner`), each following input form → loading →
  result + CTA.
