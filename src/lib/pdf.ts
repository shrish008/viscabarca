import { jsPDF } from "jspdf";
import { WHATSAPP_NUMBER } from "./config";

const PURPLE: [number, number, number] = [75, 31, 111];
const GOLD: [number, number, number] = [201, 162, 39];
const GOLD_DEEP: [number, number, number] = [134, 89, 26];
const INK: [number, number, number] = [34, 26, 43];
const MUTED: [number, number, number] = [110, 100, 120];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - MARGIN * 2;

function drawLogo(doc: jsPDF, x: number, y: number, size: number) {
  const r = size / 2;
  const cx = x + r;
  const cy = y + r;
  doc.setFillColor(...PURPLE);
  doc.circle(cx, cy, r, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, r - 0.6, "S");
  doc.setFont("times", "bold");
  doc.setTextColor(...GOLD);
  doc.setFontSize(size * 2.1);
  doc.text("M", cx, cy + size * 0.32, { align: "center" });
}

function addWatermark(doc: jsPDF) {
  doc.saveGraphicsState();
  // @ts-expect-error jsPDF's GState typing isn't exported cleanly
  doc.setGState(new doc.GState({ opacity: 0.06 }));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(46);
  doc.setTextColor(...PURPLE);
  // Rotated 46pt text has a tall bounding box (~70mm) around its anchor —
  // keep anchors well clear of the header (ends ~68mm) and footer
  // (starts ~281mm) so the watermark never overlaps live content.
  for (const y of [140, 230]) {
    doc.text("MAGICAL REALM", PAGE_W / 2, y, { align: "center", angle: 35 });
  }
  doc.restoreGraphicsState();
}

// jsPDF's built-in standard fonts (Helvetica/Times) don't include the
// Indian Rupee glyph (₹) — it renders as a broken/substituted character.
// Swap it for a plain-ASCII prefix that's guaranteed to render correctly.
function pdfSafe(text: string): string {
  return text.replace(/₹/g, "Rs. ");
}

function drawHeader(doc: jsPDF, title: string, subtitle: string) {
  addWatermark(doc);
  drawLogo(doc, MARGIN, 14, 16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD_DEEP);
  doc.text("MAGICAL REALM", MARGIN + 20, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Premium wedding & event decor, Chennai", MARGIN + 20, 25);

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, 36, PAGE_W - MARGIN, 36);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text(title, MARGIN, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text(subtitle, MARGIN, 58);

  return 68;
}

function drawFooter(doc: jsPDF) {
  const y = PAGE_H - 16;
  doc.setDrawColor(220, 210, 225);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y - 6, PAGE_W - MARGIN, y - 6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text("Love this? Let's build it for real.", MARGIN, y);
  doc.setTextColor(...GOLD_DEEP);
  doc.setFont("helvetica", "bold");
  doc.text(`WhatsApp +${WHATSAPP_NUMBER.replace(/^91/, "91 ")}`, PAGE_W - MARGIN, y, { align: "right" });
}

class Cursor {
  y: number;
  doc: jsPDF;
  title: string;
  subtitle: string;
  constructor(doc: jsPDF, start: number, title: string, subtitle: string) {
    this.doc = doc;
    this.title = title;
    this.subtitle = subtitle;
    this.y = start;
  }
  ensure(space: number) {
    if (this.y + space > PAGE_H - 24) {
      drawFooter(this.doc);
      this.doc.addPage();
      this.y = drawHeader(this.doc, this.title, this.subtitle);
    }
  }
}

function sectionLabel(doc: jsPDF, cursor: Cursor, label: string) {
  cursor.ensure(10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...GOLD_DEEP);
  doc.text(label.toUpperCase(), MARGIN, cursor.y);
  cursor.y += 6;
}

function bodyText(doc: jsPDF, cursor: Cursor, text: string, size = 10.5, color = INK) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines: string[] = doc.splitTextToSize(pdfSafe(text), CONTENT_W);
  for (const line of lines) {
    cursor.ensure(6);
    doc.text(line, MARGIN, cursor.y);
    cursor.y += 5.5;
  }
}

export interface PdfExportMeta {
  eventType: string;
  detailLine: string;
}

export function exportBudgetPdf(params: {
  meta: PdfExportMeta;
  perHead: string;
  verdict: string;
  verdictNote: string;
  categories: { label: string; amount: string; share: string }[];
  totalBudget: string;
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const title = "Event Budget Plan";
  const subtitle = params.meta.detailLine;
  const cursor = new Cursor(doc, drawHeader(doc, title, subtitle), title, subtitle);

  sectionLabel(doc, cursor, "Overview");
  bodyText(doc, cursor, `Total budget: ${params.totalBudget}`, 12, PURPLE);
  bodyText(doc, cursor, `Per-head cost: ${params.perHead}`);
  bodyText(doc, cursor, `Verdict: ${params.verdict}`, 10.5, GOLD_DEEP);
  bodyText(doc, cursor, params.verdictNote);
  cursor.y += 4;

  sectionLabel(doc, cursor, "Itemized breakdown");
  cursor.ensure(8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  doc.text("Category", MARGIN, cursor.y);
  doc.text("Share", MARGIN + 110, cursor.y);
  doc.text("Amount", PAGE_W - MARGIN, cursor.y, { align: "right" });
  cursor.y += 2;
  doc.setDrawColor(230, 222, 235);
  doc.line(MARGIN, cursor.y, PAGE_W - MARGIN, cursor.y);
  cursor.y += 6;

  for (const cat of params.categories) {
    cursor.ensure(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(cat.label, MARGIN, cursor.y);
    doc.text(cat.share, MARGIN + 110, cursor.y);
    doc.text(pdfSafe(cat.amount), PAGE_W - MARGIN, cursor.y, { align: "right" });
    cursor.y += 7.5;
  }

  drawFooter(doc);
  doc.save(`magical-realm-budget-plan-${Date.now()}.pdf`);
}

export function exportDressPdf(params: {
  meta: PdfExportMeta;
  suggestions: { title: string; colours: string[]; menLook: string; womenLook: string; note: string }[];
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const title = "Dress Code Plan";
  const subtitle = params.meta.detailLine;
  const cursor = new Cursor(doc, drawHeader(doc, title, subtitle), title, subtitle);

  params.suggestions.forEach((s, i) => {
    cursor.ensure(14);
    sectionLabel(doc, cursor, `Look ${i + 1}`);
    bodyText(doc, cursor, s.title, 12, PURPLE);
    bodyText(doc, cursor, `Palette: ${s.colours.join(" · ")}`, 9.5, GOLD_DEEP);
    cursor.y += 1;
    bodyText(doc, cursor, s.menLook);
    bodyText(doc, cursor, s.womenLook);
    bodyText(doc, cursor, s.note, 9, MUTED);
    cursor.y += 5;
  });

  drawFooter(doc);
  doc.save(`magical-realm-dress-code-plan-${Date.now()}.pdf`);
}

export function exportDecorPdf(params: {
  meta: PdfExportMeta;
  concepts: { label: string }[];
  selectedLabel: string;
  prompt: string;
  freeText: string;
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const title = "Decor & Stage Concept";
  const subtitle = params.meta.detailLine;
  const cursor = new Cursor(doc, drawHeader(doc, title, subtitle), title, subtitle);

  sectionLabel(doc, cursor, "Selected direction");
  bodyText(doc, cursor, params.selectedLabel, 12, PURPLE);
  cursor.y += 3;

  sectionLabel(doc, cursor, "Other concept directions explored");
  bodyText(doc, cursor, params.concepts.map((c) => c.label).join("  ·  "));
  cursor.y += 3;

  if (params.freeText.trim()) {
    sectionLabel(doc, cursor, "Your notes");
    bodyText(doc, cursor, params.freeText.trim());
    cursor.y += 3;
  }

  sectionLabel(doc, cursor, "Generation brief");
  bodyText(doc, cursor, params.prompt, 9, MUTED);
  cursor.y += 4;

  bodyText(
    doc,
    cursor,
    "These are styled concept directions, not final photorealistic renders. Our design team will turn your favourite into a real, on-site build.",
    9.5,
    MUTED,
  );

  drawFooter(doc);
  doc.save(`magical-realm-decor-concept-${Date.now()}.pdf`);
}
