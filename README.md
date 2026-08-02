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
result into the outbound message, and can also be exported as a
watermarked, logo-branded PDF (name/phone/email optional). Every completed
session — viewing a result, clicking WhatsApp, or exporting a PDF — is
logged as a lead (`src/lib/leads.ts`): always to the browser's local
storage, and to a real backend database once `server/` is running (see
below).

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

To also persist leads to a real database, run the backend in a second
terminal — see `server/README.md`:

```bash
cd server && npm install && npm start
```

then set `VITE_API_BASE_URL=http://localhost:3001` in `.env.local` and
restart `npm run dev`.

## Before going live

1. **WhatsApp number** — already set to the live number in
   `src/lib/config.ts`; `VITE_WHATSAPP_NUMBER` only needs setting if you
   want a different number for a staging environment.
2. **Backend database** — run `server/` (Express + SQLite) somewhere with a
   persistent filesystem (see `server/README.md` for why serverless hosts
   don't work for this) and set `VITE_API_BASE_URL` in production. Without
   it, leads still land in the browser's local storage and in the outbound
   WhatsApp/PDF, so nothing is silently lost — they just won't reach a
   central database.
3. **Logo** — `src/components/Logo.tsx` is a hand-built SVG recreation of
   the brand mark (no source image file was available to embed directly).
   Swap in the real logo file for pixel-perfect branding.
4. **"Why Magical Realm" trust strip** (`src/pages/Home.tsx`) currently uses
   text cards, not real photos — swap in real event photography per the
   brand brief.
5. **Decor & Stage Planner image generation** — per the build brief, this is
   intentionally shipped last and only with a curated preset/concept
   fallback (`src/lib/decor.ts`, `src/components/DecorConceptCard.tsx`).
   Do not expose real AI-generated renders until they've been validated as
   genuinely premium: wire in an image API (fal.ai / Replicate / Imagen)
   behind a server-side call (never call it with a secret key directly from
   the browser), keep the existing graceful fallback to the concept gallery,
   and rate-limit/cache generations to control cost.
6. **Brand palette / fonts** — tokens live in `src/index.css` (`@theme`
   block): deep purple primary, gold secondary, Anton (display) + Alex
   Brush (script accent) + Work Sans (body), self-hosted under
   `public/fonts/`.

## Structure

- `src/context/EventContext.tsx` — cross-tool event state (event type, guest
  count, city, budget, palette) held in memory and shared across all three
  tools, so completing one pre-fills the others.
- `src/lib/budget.ts`, `src/lib/dressCode.ts`, `src/lib/decor.ts` —
  deterministic domain logic per module, kept separate from UI.
- `src/lib/pdf.ts` — builds the branded, watermarked PDF per tool (jsPDF,
  dynamically imported only when someone actually clicks export, so it
  never weighs down the initial page load).
- `src/lib/leads.ts`, `src/lib/whatsapp.ts` — the lead-capture + WhatsApp CTA
  plumbing shared by all three result screens.
- `src/pages/*` — one screen per tool (`Home`, `BudgetPlanner`,
  `DressCodePlanner`, `DecorPlanner`), each following input form → loading →
  result + CTA, code-split per route.
- `server/` — the Express + SQLite backend. Entirely optional to run; the
  frontend degrades gracefully without it.
