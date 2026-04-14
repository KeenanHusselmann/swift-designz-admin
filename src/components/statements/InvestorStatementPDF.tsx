import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf", fontWeight: 700 },
  ],
});

const s = StyleSheet.create({
  page: { backgroundColor: "#fff", padding: 50, fontFamily: "Inter", fontSize: 9, color: "#333" },
  // Header
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6, paddingBottom: 10, borderBottomWidth: 2, borderColor: "#000" },
  brandName: { fontSize: 14, fontWeight: 700, color: "#000", textTransform: "uppercase" as const, letterSpacing: 2 },
  brandSub: { fontSize: 8, color: "#666", marginTop: 3 },
  docTitle: { textAlign: "right" as const },
  docLabel: { fontSize: 14, fontWeight: 700, color: "#000", textTransform: "uppercase" as const },
  docPeriod: { fontSize: 9, color: "#555", marginTop: 4 },
  // Prepared for
  recipientBox: { marginTop: 16, marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: "#ccc" },
  sectionLabel: { fontSize: 7, fontWeight: 700, letterSpacing: 2, color: "#000", textTransform: "uppercase" as const, marginBottom: 6 },
  recipientName: { fontSize: 11, fontWeight: 700, color: "#000", marginBottom: 2 },
  recipientLine: { fontSize: 9, color: "#555", marginBottom: 1.5 },
  // Section heading
  sectionHeading: { fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "#000", textTransform: "uppercase" as const, marginTop: 18, marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderColor: "#999" },
  // Summary rows
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" },
  summaryLabel: { fontSize: 9, color: "#555" },
  summaryValue: { fontSize: 9, fontWeight: 600, color: "#000" },
  summaryTotalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, marginTop: 4, borderTopWidth: 1.5, borderColor: "#000" },
  summaryTotalLabel: { fontSize: 9, fontWeight: 700, color: "#000" },
  summaryTotalValue: { fontSize: 9, fontWeight: 700, color: "#000" },
  // Table
  tableHead: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 1.5, borderColor: "#000" },
  tableRow: { flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" },
  tableTotalRow: { flexDirection: "row", paddingVertical: 5, borderTopWidth: 1.5, borderColor: "#000", marginTop: 2 },
  headText: { fontSize: 7, fontWeight: 700, color: "#000", textTransform: "uppercase" as const, letterSpacing: 1 },
  cellText: { fontSize: 9, color: "#333" },
  cellBold: { fontSize: 9, fontWeight: 700, color: "#000" },
  empty: { fontSize: 9, color: "#888", paddingVertical: 10 },
  // Columns
  colDate: { width: "18%" },
  colDesc: { flex: 1 },
  colAmt: { width: "22%", textAlign: "right" as const },
  // Footer
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, borderTopWidth: 1, borderColor: "#ccc", paddingTop: 8, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#888" },
});

export interface InvestorStatementPDFProps {
  investorName: string;
  investorCompany: string | null;
  investorEmail: string | null;
  investorPhone: string | null;
  investmentAmount: number;
  equityPercentage: number | null;
  totalContributed: number;
  monthTotal: number;
  contributions: { date: string; description: string; amount: number }[];
  monthLabel: string;
  generatedAt: string;
}

function formatR(cents: number) {
  return `R ${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

export default function InvestorStatementPDF({
  investorName,
  investorCompany,
  investorEmail,
  investorPhone,
  investmentAmount,
  equityPercentage,
  totalContributed,
  monthTotal,
  contributions,
  monthLabel,
  generatedAt,
}: InvestorStatementPDFProps) {
  const outstanding = Math.max(0, investmentAmount - totalContributed);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>Swift Designz</Text>
            <Text style={s.brandSub}>swiftdesignz.co.za</Text>
          </View>
          <View style={s.docTitle}>
            <Text style={s.docLabel}>Investor Statement</Text>
            <Text style={s.docPeriod}>Period: {monthLabel}</Text>
          </View>
        </View>

        {/* Prepared For */}
        <View style={s.recipientBox}>
          <Text style={s.sectionLabel}>Prepared For</Text>
          <Text style={s.recipientName}>{investorName}</Text>
          {investorCompany && <Text style={s.recipientLine}>{investorCompany}</Text>}
          {investorEmail && <Text style={s.recipientLine}>{investorEmail}</Text>}
          {investorPhone && <Text style={s.recipientLine}>{investorPhone}</Text>}
        </View>

        {/* Investment Summary */}
        <Text style={s.sectionHeading}>Investment Summary</Text>

        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Commitment Amount</Text>
          <Text style={s.summaryValue}>{formatR(investmentAmount)}</Text>
        </View>
        {equityPercentage !== null && (
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Equity Percentage</Text>
            <Text style={s.summaryValue}>{equityPercentage}%</Text>
          </View>
        )}
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Total Contributed to Date</Text>
          <Text style={s.summaryValue}>{formatR(totalContributed)}</Text>
        </View>
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>Contributed This Period</Text>
          <Text style={s.summaryValue}>{formatR(monthTotal)}</Text>
        </View>
        <View style={s.summaryTotalRow}>
          <Text style={s.summaryTotalLabel}>Outstanding Commitment</Text>
          <Text style={s.summaryTotalValue}>{formatR(outstanding)}</Text>
        </View>

        {/* Transactions */}
        <Text style={s.sectionHeading}>Transactions — {monthLabel}</Text>

        <View style={s.tableHead}>
          <Text style={[s.headText, s.colDate]}>Date</Text>
          <Text style={[s.headText, s.colDesc]}>Description</Text>
          <Text style={[s.headText, s.colAmt]}>Amount</Text>
        </View>

        {contributions.length === 0 ? (
          <Text style={s.empty}>No transactions recorded for this period.</Text>
        ) : (
          contributions.map((c, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={[s.cellText, s.colDate]}>{fmtDate(c.date)}</Text>
              <Text style={[s.cellText, s.colDesc]}>{c.description}</Text>
              <Text style={[s.cellBold, s.colAmt]}>{formatR(c.amount)}</Text>
            </View>
          ))
        )}

        <View style={s.tableTotalRow}>
          <Text style={[s.cellBold, s.colDate]} />
          <Text style={[s.cellBold, s.colDesc]}>Total This Period</Text>
          <Text style={[s.cellBold, s.colAmt]}>{formatR(monthTotal)}</Text>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Generated: {generatedAt} · Swift Designz — Confidential</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
