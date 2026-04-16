import { StyleSheet, Font } from "@react-pdf/renderer";

/* ── Font Registration ─────────────────────── */
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf", fontWeight: 700 },
  ],
});

/* ── Brand Colours ─────────────────────────── */
export const C = {
  teal: "#30B0B0",
  tealDim: "#4a8080",
  bg: "#101010",
  surface: "#1a1a1a",
  border: "#2a2a2a",
  white: "#ffffff",
  text: "#cccccc",
  textDim: "#999999",
  textMuted: "#888888",
  textFaint: "#555555",
} as const;

/* ── Shared Styles ─────────────────────────── */
export const ds = StyleSheet.create({
  /* Page */
  page: {
    backgroundColor: C.bg,
    padding: 40,
    fontFamily: "Inter",
    fontSize: 9,
    color: C.text,
  },

  /* Header */
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 40, height: 40 },
  brandName: { fontSize: 16, fontWeight: 700, letterSpacing: 3, color: C.teal, textTransform: "uppercase" as const },
  brandSub: { fontSize: 8, color: C.tealDim, letterSpacing: 2, marginTop: 2, textTransform: "uppercase" as const },
  docTitle: { textAlign: "right" as const },
  docLabel: { fontSize: 16, fontWeight: 700, color: C.white, letterSpacing: 2, textTransform: "uppercase" as const },
  docMetaLine: { fontSize: 8, color: C.textMuted, marginTop: 3 },
  docMetaVal: { color: C.text, fontWeight: 600 },

  /* Info / Warn Boxes */
  infoBox: {
    backgroundColor: C.surface,
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
  },
  infoText: { fontSize: 8.5, color: C.text, lineHeight: 1.65 },
  warnBox: {
    backgroundColor: "#1e1810",
    borderLeftWidth: 3,
    borderLeftColor: "#e09030",
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
  },
  warnText: { fontSize: 8.5, color: "#d4a060", lineHeight: 1.65 },

  /* Section Heading */
  sectionNum: { fontSize: 8, fontWeight: 700, letterSpacing: 3, color: C.teal, marginBottom: 2 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: C.white, marginBottom: 6 },
  sectionBody: { fontSize: 8.5, color: C.text, lineHeight: 1.7, marginBottom: 4 },
  sectionWrap: { marginBottom: 14 },

  /* Bullets */
  bulletRow: { flexDirection: "row", marginBottom: 3, paddingLeft: 6 },
  bulletDot: { width: 10, fontSize: 8.5, color: C.teal },
  bulletText: { flex: 1, fontSize: 8.5, color: C.text, lineHeight: 1.6 },

  /* Tables */
  table: { marginBottom: 14 },
  tableHead: { flexDirection: "row", backgroundColor: C.surface, paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: C.border },
  tableRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: C.border },
  tableRowAlt: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 1, borderColor: C.border, backgroundColor: "#151515" },
  thText: { fontSize: 7, fontWeight: 700, letterSpacing: 2, color: C.textMuted, textTransform: "uppercase" as const },
  tdText: { fontSize: 8.5, color: C.text },
  tdBold: { fontSize: 8.5, color: C.white, fontWeight: 600 },

  /* Parties */
  parties: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  party: { width: "48%" },
  partyLabel: { fontSize: 7, fontWeight: 700, letterSpacing: 3, color: C.teal, textTransform: "uppercase" as const, marginBottom: 6 },
  partyName: { fontSize: 11, fontWeight: 700, color: C.white, marginBottom: 2 },
  partyLine: { fontSize: 8, color: C.textDim, marginBottom: 1.5 },

  /* Signatures */
  sigRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 28 },
  sigBlock: { width: "45%" },
  sigLabel: { fontSize: 7, fontWeight: 700, letterSpacing: 3, color: C.tealDim, textTransform: "uppercase" as const, marginBottom: 4 },
  sigLine: { borderBottomWidth: 1, borderColor: C.textMuted, height: 36, marginBottom: 6 },
  sigName: { fontSize: 8, color: C.textDim, marginBottom: 1 },

  /* Checklist */
  checkRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 5, paddingLeft: 4 },
  checkBox: { width: 10, height: 10, borderWidth: 1, borderColor: C.teal, borderRadius: 2, marginRight: 8, marginTop: 1 },
  checkText: { flex: 1, fontSize: 8.5, color: C.text, lineHeight: 1.5 },

  /* Banking Block */
  bankingBox: {
    backgroundColor: "#1e4848",
    borderLeftWidth: 4,
    borderLeftColor: C.teal,
    padding: 14,
    marginBottom: 16,
    borderRadius: 4,
  },
  bankingLabel: { fontSize: 7, fontWeight: 700, letterSpacing: 3, color: C.teal, textTransform: "uppercase" as const, marginBottom: 10 },
  bankingGrid: { flexDirection: "row", flexWrap: "wrap" },
  bankingItem: { width: "50%", marginBottom: 6 },
  bankingKey: { fontSize: 7, letterSpacing: 2, textTransform: "uppercase" as const, color: "#70b0b0" },
  bankingVal: { fontSize: 10, fontWeight: 700, color: "#e8fafa" },

  /* Divider */
  divider: { borderBottomWidth: 1, borderColor: C.border, marginVertical: 14 },

  /* Footer */
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderColor: C.border, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: C.textFaint },
  footerTeal: { fontSize: 7, color: C.teal },
});

/* ── Content Block Types ───────────────────── */

export interface InfoBlock { type: "info"; text: string }
export interface WarnBlock { type: "warn"; text: string }
export interface SectionBlock { type: "section"; number: string; title: string; body?: string; bullets?: string[] }
export interface TableBlock { type: "table"; headers: string[]; rows: string[][]; colWidths?: number[] }
export interface PartiesBlock { type: "parties" }
export interface SignaturesBlock { type: "signatures"; leftLabel?: string; rightLabel?: string }
export interface ChecklistBlock { type: "checklist"; title?: string; items: string[] }
export interface BankingBlock { type: "banking" }
export interface DividerBlock { type: "divider" }

export type ContentBlock =
  | InfoBlock
  | WarnBlock
  | SectionBlock
  | TableBlock
  | PartiesBlock
  | SignaturesBlock
  | ChecklistBlock
  | BankingBlock
  | DividerBlock;

export interface TemplateDocument {
  title: string;
  subtitle: string;
  ref: string;
  version: string;
  effective: string;
  blocks: ContentBlock[];
}
