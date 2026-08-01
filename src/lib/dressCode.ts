import type { EventType } from "../types";

export type DressGroup = "Bride/Groom side" | "Family" | "Friends gang" | "Couple";
export type DressVibe = "Traditional" | "Modern" | "Fusion";

export const DRESS_GROUPS: DressGroup[] = [
  "Bride/Groom side",
  "Family",
  "Friends gang",
  "Couple",
];

export const DRESS_VIBES: DressVibe[] = ["Traditional", "Modern", "Fusion"];

export interface DressSuggestion {
  title: string;
  colours: string[];
  menLook: string;
  womenLook: string;
  note: string;
}

const DEFAULT_PALETTES: Record<DressVibe, string[][]> = {
  Traditional: [
    ["Maroon", "Gold", "Ivory"],
    ["Emerald", "Mustard", "Cream"],
    ["Royal Blue", "Silver", "Off-white"],
  ],
  Modern: [
    ["Sage", "Blush", "Ivory"],
    ["Champagne", "Dusty Rose", "White"],
    ["Slate Blue", "Silver Grey", "White"],
  ],
  Fusion: [
    ["Rust", "Teal", "Sand"],
    ["Coral", "Gold", "Cream"],
    ["Berry", "Blush", "Gold"],
  ],
};

const MEN_LOOKS: Record<DressVibe, string[]> = {
  Traditional: [
    "silk kurta with an angavastram, matched to the palette",
    "veshti with a contrast-border angavastram and a simple gold chain",
    "raw silk sherwani in the deepest palette shade",
  ],
  Modern: [
    "linen shirt and tailored trousers, tonal with the palette",
    "a light bandhgala or blazer over a plain shirt",
    "monochrome linen co-ord in the lightest palette shade",
  ],
  Fusion: [
    "an Indo-western jacket over a plain kurta",
    "a Nehru jacket with slim trousers, one palette accent",
    "a printed bandhgala paired with plain trousers",
  ],
};

const WOMEN_LOOKS: Record<DressVibe, string[]> = {
  Traditional: [
    "Kanjivaram or silk saree in the primary palette colour, gold jewellery",
    "half-saree or pattu pavadai for younger members, same palette",
    "silk saree with a contrast blouse in the accent shade",
  ],
  Modern: [
    "organza or georgette saree, pastel palette, minimal jewellery",
    "a flowy gown or Anarkali in the softest palette tone",
    "a modern pre-draped saree with statement earrings",
  ],
  Fusion: [
    "a dhoti-pants and crop-top set in palette colours",
    "a pre-stitched saree gown with a contrast dupatta",
    "a Indo-western jacket dress with palette embroidery",
  ],
};

const GROUP_FRAMING: Record<DressGroup, string> = {
  "Bride/Groom side": "Coordinate as the front row — same palette, slightly more elevated fabric than the rest of the guest list.",
  "Family": "Elders lean into richer, more traditional pieces; younger family members can go one shade lighter in the same palette.",
  "Friends gang": "Keep it playful and photogenic — same palette across the group reads as 'coordinated', not 'costume'.",
  "Couple": "His-and-hers coordination — same palette, not identical outfits, so photos read as a pair without looking matchy.",
};

function pickPalette(vibe: DressVibe, providedPalette: string[]): string[][] {
  if (providedPalette.length >= 2) {
    return [providedPalette, ...DEFAULT_PALETTES[vibe].slice(0, 2)];
  }
  return DEFAULT_PALETTES[vibe];
}

export function getDressSuggestions(params: {
  eventType: EventType | null;
  group: DressGroup;
  vibe: DressVibe;
  palette: string[];
}): DressSuggestion[] {
  const { group, vibe, palette } = params;
  const palettes = pickPalette(vibe, palette);
  const menLooks = MEN_LOOKS[vibe];
  const womenLooks = WOMEN_LOOKS[vibe];
  const framing = GROUP_FRAMING[group];

  return palettes.map((colours, i) => ({
    title: `${group}: coordinated ${vibe.toLowerCase()} — ${colours.join(", ").toLowerCase()}`,
    colours,
    menLook: `Men in ${menLooks[i % menLooks.length]}`,
    womenLook: `Women in ${womenLooks[i % womenLooks.length]}`,
    note: framing,
  }));
}
