// Country metadata derived from ISO numeric country IDs used in sourceLocations.
export const countryMeta: Record<string, { name: string; flag: string }> = {
  "108": { name: "Burundi", flag: "🇧🇮" },
  "646": { name: "Rwanda", flag: "🇷🇼" },
  "180": { name: "DR Congo", flag: "🇨🇩" },
  "178": { name: "Rep. Congo", flag: "🇨🇬" },
  "404": { name: "Kenya", flag: "🇰🇪" },
  "834": { name: "Tanzania", flag: "🇹🇿" },
  "800": { name: "Uganda", flag: "🇺🇬" },
  "384": { name: "Côte d'Ivoire", flag: "🇨🇮" },
  "276": { name: "Germany", flag: "🇩🇪" },
  "056": { name: "Belgium", flag: "🇧🇪" },
  "840": { name: "United States", flag: "🇺🇸" },
  "826": { name: "United Kingdom", flag: "🇬🇧" },
  "710": { name: "South Africa", flag: "🇿🇦" },
};

export const globalCountry = { name: "Global", flag: "🌍" };

// Curated brand colors for known media / institutions.
// Anything not listed falls back to a deterministic palette.
const knownSourceColors: Record<string, string> = {
  "Reuters Africa": "bg-orange-500",
  UNICEF: "bg-sky-500",
  "WHO Africa": "bg-blue-600",
  VENRO: "bg-teal-500",
  "The East African": "bg-rose-500",
  AfDB: "bg-emerald-600",
  Devex: "bg-violet-600",
  "BMZ Newsletter": "bg-amber-600",
  "EU Delegation Brussels": "bg-indigo-600",
  "Stiftung Umverteilen": "bg-pink-500",
  Misereor: "bg-red-600",
  "Robert Bosch Stiftung": "bg-slate-700",
  "GIZ Bonn": "bg-cyan-700",
  "State of NRW": "bg-fuchsia-600",
};

const fallbackPalette = [
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-indigo-500",
];

export function sourceColor(name: string): string {
  if (knownSourceColors[name]) return knownSourceColors[name];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return fallbackPalette[h % fallbackPalette.length] ?? "bg-sky-500";
}

export function sourceInitials(name: string): string {
  const parts = name
    .replace(/\(.+?\)/g, "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0];
  const second = parts[1];
  if (!first) return "?";
  if (!second) return first.slice(0, 2).toUpperCase();
  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase();
}
