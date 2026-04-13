import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf", fontWeight: 700 },
  ],
});

const teal = "#30B0B0";
const bg = "#101010";
const surface = "#1a1a1a";
const border = "#2a2a2a";

const s = StyleSheet.create({
  page: { backgroundColor: bg, padding: 40, fontFamily: "Inter", fontSize: 9, color: "#ccc" },
  // Header
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  brand: {},
  brandName: { fontSize: 16, fontWeight: 700, letterSpacing: 3, color: teal, textTransform: "uppercase" as const },
  brandSub: { fontSize: 8, color: "#4a8080", letterSpacing: 2, marginTop: 2, textTransform: "uppercase" as const },
  invoiceTitle: { textAlign: "right" as const },
  invoiceLabel: { fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 2, textTransform: "uppercase" as const },
  invoiceMeta: { fontSize: 8, color: "#888", marginTop: 4 },
  invoiceMetaVal: { color: "#ccc", fontWeight: 600 },
  // Parties
  parties: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  party: { width: "48%" },
  partyLabel: { fontSize: 7, fontWeight: 700, letterSpacing: 3, color: teal, textTransform: "uppercase" as const, marginBottom: 6 },
  partyName: { fontSize: 11, fontWeight: 700, color: "#fff", marginBottom: 2 },
  partyLine: { fontSize: 8, color: "#999", marginBottom: 1.5 },
  // Table
  table: { marginBottom: 20 },
  tableHead: { flexDirection: "row", backgroundColor: surface, borderBottomWidth: 1, borderColor: border, paddingVertical: 6, paddingHorizontal: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: border, paddingVertical: 6, paddingHorizontal: 8 },
  colDesc: { flex: 1 },
  colQty: { width: 50, textAlign: "center" as const },
  colRate: { width: 70, textAlign: "right" as const },
  colAmt: { width: 80, textAlign: "right" as const },
  headText: { fontSize: 7, fontWeight: 700, letterSpacing: 2, color: "#888", textTransform: "uppercase" as const },
  cellText: { fontSize: 9, color: "#ccc" },
  cellBold: { fontSize: 9, fontWeight: 600, color: "#fff" },
  // Totals
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 4 },
  totalLabel: { fontSize: 9, color: "#888", marginRight: 20, width: 100, textAlign: "right" as const },
  totalVal: { fontSize: 9, color: "#fff", fontWeight: 700, width: 80, textAlign: "right" as const },
  totalTeal: { fontSize: 12, color: teal, fontWeight: 700, width: 80, textAlign: "right" as const },
  // Status badge
  statusRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8, marginBottom: 24 },
  badge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 4, fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" as const },
  // Notes
  notesBox: { backgroundColor: surface, borderWidth: 1, borderColor: border, borderRadius: 6, padding: 12, marginBottom: 20 },
  notesLabel: { fontSize: 7, fontWeight: 700, letterSpacing: 3, color: teal, marginBottom: 4, textTransform: "uppercase" as const },
  notesText: { fontSize: 8, color: "#aaa", lineHeight: 1.6 },
  // Footer
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderColor: border, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#555" },
  footerTeal: { fontSize: 7, color: teal },
});

interface InvoicePDFProps {
  invoiceNumber: string;
  status: string;
  dueDate: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  clientPhone?: string | null;
  items: { description: string; quantity: number; unit_rate: number; amount: number }[];
  total: number;
  paidAmount: number;
  notes?: string | null;
}

function formatR(cents: number) {
  const r = cents / 100;
  return `R${r.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

function badgeColor(status: string) {
  switch (status) {
    case "paid": return { backgroundColor: "#0d3320", color: "#4ade80" };
    case "partial": return { backgroundColor: "#302010", color: "#fbbf24" };
    case "overdue": return { backgroundColor: "#301010", color: "#f87171" };
    case "sent": return { backgroundColor: "#102030", color: "#60a5fa" };
    case "cancelled": return { backgroundColor: "#1a1a1a", color: "#888" };
    default: return { backgroundColor: surface, color: "#ccc" };
  }
}

export default function InvoicePDF({
  invoiceNumber,
  status,
  dueDate,
  createdAt,
  clientName,
  clientEmail,
  clientCompany,
  clientPhone,
  items,
  total,
  paidAmount,
  notes,
}: InvoicePDFProps) {
  const outstanding = total - paidAmount;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.brand}>
            <Text style={s.brandName}>Swift Designz</Text>
            <Text style={s.brandSub}>swiftdesignz.co.za</Text>
          </View>
          <View style={s.invoiceTitle}>
            <Text style={s.invoiceLabel}>Invoice</Text>
            <Text style={s.invoiceMeta}>
              <Text style={s.invoiceMetaVal}>{invoiceNumber}</Text>
            </Text>
            <Text style={s.invoiceMeta}>
              Issued: <Text style={s.invoiceMetaVal}>{fmtDate(createdAt)}</Text>
            </Text>
            <Text style={s.invoiceMeta}>
              Due: <Text style={s.invoiceMetaVal}>{fmtDate(dueDate)}</Text>
            </Text>
          </View>
        </View>

        {/* Parties */}
        <View style={s.parties}>
          <View style={s.party}>
            <Text style={s.partyLabel}>Bill To</Text>
            <Text style={s.partyName}>{clientName}</Text>
            {clientCompany && <Text style={s.partyLine}>{clientCompany}</Text>}
            <Text style={s.partyLine}>{clientEmail}</Text>
            {clientPhone && <Text style={s.partyLine}>{clientPhone}</Text>}
          </View>
          <View style={s.party}>
            <Text style={s.partyLabel}>From</Text>
            <Text style={s.partyName}>Keenan Husselmann</Text>
            <Text style={s.partyLine}>Trading as Swift Designz</Text>
            <Text style={s.partyLine}>keenan@swiftdesignz.co.za</Text>
            <Text style={s.partyLine}>+264 81 853 6789</Text>
            <Text style={s.partyLine}>Remote · Worldwide</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={s.table}>
          <View style={s.tableHead}>
            <Text style={[s.headText, s.colDesc]}>Description</Text>
            <Text style={[s.headText, s.colQty]}>Qty</Text>
            <Text style={[s.headText, s.colRate]}>Rate</Text>
            <Text style={[s.headText, s.colAmt]}>Amount</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={[s.cellText, s.colDesc]}>{item.description}</Text>
              <Text style={[s.cellText, s.colQty]}>{item.quantity}</Text>
              <Text style={[s.cellText, s.colRate]}>{formatR(item.unit_rate)}</Text>
              <Text style={[s.cellBold, s.colAmt]}>{formatR(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Subtotal</Text>
          <Text style={s.totalVal}>{formatR(total)}</Text>
        </View>
        {paidAmount > 0 && (
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Paid</Text>
            <Text style={[s.totalVal, { color: "#4ade80" }]}>-{formatR(paidAmount)}</Text>
          </View>
        )}
        <View style={[s.totalRow, { marginTop: 4, paddingTop: 6, borderTopWidth: 1, borderColor: border }]}>
          <Text style={[s.totalLabel, { fontSize: 11 }]}>Amount Due</Text>
          <Text style={s.totalTeal}>{formatR(outstanding)}</Text>
        </View>

        {/* Status Badge */}
        <View style={s.statusRow}>
          <Text style={[s.badge, badgeColor(status)]}>{status}</Text>
        </View>

        {/* Notes */}
        {notes && (
          <View style={s.notesBox}>
            <Text style={s.notesLabel}>Notes</Text>
            <Text style={s.notesText}>{notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Swift Designz · admin.swiftdesignz.co.za</Text>
          <Text style={s.footerTeal}>{invoiceNumber}</Text>
        </View>
      </Page>
    </Document>
  );
}
