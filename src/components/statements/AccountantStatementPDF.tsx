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
  // Section heading
  sectionHeading: { fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "#000", textTransform: "uppercase" as const, marginTop: 20, marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderColor: "#999" },
  // P&L Summary rows
  plRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" },
  plLabel: { fontSize: 9, color: "#555" },
  plValue: { fontSize: 9, fontWeight: 600, color: "#000" },
  plNetRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 1.5, borderColor: "#000", marginTop: 4 },
  plNetLabel: { fontSize: 10, fontWeight: 700, color: "#000" },
  plNetValue: { fontSize: 10, fontWeight: 700, color: "#000" },
  // Category table
  catHead: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 1.5, borderColor: "#000" },
  catRow: { flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" },
  catTotalRow: { flexDirection: "row", paddingVertical: 5, borderTopWidth: 1.5, borderColor: "#000", marginTop: 2 },
  headText: { fontSize: 7, fontWeight: 700, color: "#000", textTransform: "uppercase" as const, letterSpacing: 1 },
  cellText: { fontSize: 9, color: "#333" },
  cellBold: { fontSize: 9, fontWeight: 700, color: "#000" },
  // Category columns
  catColName: { flex: 1 },
  catColCount: { width: "15%", textAlign: "center" as const },
  catColTotal: { width: "28%", textAlign: "right" as const },
  // Ledger table
  ledgerHead: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 1.5, borderColor: "#000" },
  ledgerRow: { flexDirection: "row", paddingVertical: 4, borderBottomWidth: 1, borderColor: "#eee" },
  ledgerColDate: { width: "16%" },
  ledgerColDesc: { flex: 1 },
  ledgerColCat: { width: "22%" },
  ledgerColAmt: { width: "18%", textAlign: "right" as const },
  empty: { fontSize: 9, color: "#888", paddingVertical: 8 },
  // Footer
  footer: { position: "absolute", bottom: 30, left: 50, right: 50, borderTopWidth: 1, borderColor: "#ccc", paddingTop: 8, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#888" },
});

export interface CategoryBreakdown {
  category: string;
  label: string;
  count: number;
  total: number;
}

export interface LedgerEntry {
  date: string;
  description: string;
  categoryLabel: string;
  amount: number;
}

export interface AccountantStatementPDFProps {
  monthLabel: string;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeByCategory: CategoryBreakdown[];
  expenseByCategory: CategoryBreakdown[];
  incomeLedger: LedgerEntry[];
  expenseLedger: LedgerEntry[];
  generatedAt: string;
}

function formatR(cents: number) {
  return `R ${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AccountantStatementPDF({
  monthLabel,
  totalIncome,
  totalExpenses,
  netProfit,
  incomeByCategory,
  expenseByCategory,
  incomeLedger,
  expenseLedger,
  generatedAt,
}: AccountantStatementPDFProps) {
  return (
    <Document>
      <Page size="A4" style={s.page} wrap>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>Swift Designz</Text>
            <Text style={s.brandSub}>swiftdesignz.co.za</Text>
          </View>
          <View style={s.docTitle}>
            <Text style={s.docLabel}>Monthly Financial Statement</Text>
            <Text style={s.docPeriod}>Period: {monthLabel}</Text>
          </View>
        </View>

        {/* P&L Summary */}
        <Text style={s.sectionHeading}>P&L Summary</Text>

        <View style={s.plRow}>
          <Text style={s.plLabel}>Total Income</Text>
          <Text style={s.plValue}>{formatR(totalIncome)}</Text>
        </View>
        <View style={s.plRow}>
          <Text style={s.plLabel}>Total Expenses</Text>
          <Text style={s.plValue}>{formatR(totalExpenses)}</Text>
        </View>
        <View style={s.plNetRow}>
          <Text style={s.plNetLabel}>{netProfit >= 0 ? "Net Profit" : "Net Loss"}</Text>
          <Text style={s.plNetValue}>{formatR(Math.abs(netProfit))}{netProfit < 0 ? " (Loss)" : ""}</Text>
        </View>

        {/* Income by Category */}
        <Text style={s.sectionHeading}>Income by Category</Text>

        <View style={s.catHead}>
          <Text style={[s.headText, s.catColName]}>Category</Text>
          <Text style={[s.headText, s.catColCount]}>Entries</Text>
          <Text style={[s.headText, s.catColTotal]}>Total</Text>
        </View>
        {incomeByCategory.length === 0 ? (
          <Text style={s.empty}>No income recorded for this period.</Text>
        ) : (
          incomeByCategory.map((row, i) => (
            <View key={i} style={s.catRow}>
              <Text style={[s.cellText, s.catColName]}>{row.label}</Text>
              <Text style={[s.cellText, s.catColCount]}>{row.count}</Text>
              <Text style={[s.cellBold, s.catColTotal]}>{formatR(row.total)}</Text>
            </View>
          ))
        )}
        <View style={s.catTotalRow}>
          <Text style={[s.cellBold, s.catColName]}>Total</Text>
          <Text style={[s.cellBold, s.catColCount]}>{incomeByCategory.reduce((s, r) => s + r.count, 0)}</Text>
          <Text style={[s.cellBold, s.catColTotal]}>{formatR(totalIncome)}</Text>
        </View>

        {/* Expense by Category */}
        <Text style={s.sectionHeading}>Expenses by Category</Text>

        <View style={s.catHead}>
          <Text style={[s.headText, s.catColName]}>Category</Text>
          <Text style={[s.headText, s.catColCount]}>Entries</Text>
          <Text style={[s.headText, s.catColTotal]}>Total</Text>
        </View>
        {expenseByCategory.length === 0 ? (
          <Text style={s.empty}>No expenses recorded for this period.</Text>
        ) : (
          expenseByCategory.map((row, i) => (
            <View key={i} style={s.catRow}>
              <Text style={[s.cellText, s.catColName]}>{row.label}</Text>
              <Text style={[s.cellText, s.catColCount]}>{row.count}</Text>
              <Text style={[s.cellBold, s.catColTotal]}>{formatR(row.total)}</Text>
            </View>
          ))
        )}
        <View style={s.catTotalRow}>
          <Text style={[s.cellBold, s.catColName]}>Total</Text>
          <Text style={[s.cellBold, s.catColCount]}>{expenseByCategory.reduce((s, r) => s + r.count, 0)}</Text>
          <Text style={[s.cellBold, s.catColTotal]}>{formatR(totalExpenses)}</Text>
        </View>

        {/* Income Ledger */}
        <Text style={s.sectionHeading}>Income Ledger</Text>

        <View style={s.ledgerHead}>
          <Text style={[s.headText, s.ledgerColDate]}>Date</Text>
          <Text style={[s.headText, s.ledgerColDesc]}>Description</Text>
          <Text style={[s.headText, s.ledgerColCat]}>Category</Text>
          <Text style={[s.headText, s.ledgerColAmt]}>Amount</Text>
        </View>
        {incomeLedger.length === 0 ? (
          <Text style={s.empty}>No income entries.</Text>
        ) : (
          incomeLedger.map((row, i) => (
            <View key={i} style={s.ledgerRow}>
              <Text style={[s.cellText, s.ledgerColDate]}>{fmtDate(row.date)}</Text>
              <Text style={[s.cellText, s.ledgerColDesc]}>{row.description}</Text>
              <Text style={[s.cellText, s.ledgerColCat]}>{row.categoryLabel}</Text>
              <Text style={[s.cellBold, s.ledgerColAmt]}>{formatR(row.amount)}</Text>
            </View>
          ))
        )}
        <View style={[s.catTotalRow]}>
          <Text style={[s.cellBold, s.ledgerColDate]} />
          <Text style={[s.cellBold, s.ledgerColDesc]}>Total Income</Text>
          <Text style={[s.cellBold, s.ledgerColCat]} />
          <Text style={[s.cellBold, s.ledgerColAmt]}>{formatR(totalIncome)}</Text>
        </View>

        {/* Expense Ledger */}
        <Text style={s.sectionHeading}>Expense Ledger</Text>

        <View style={s.ledgerHead}>
          <Text style={[s.headText, s.ledgerColDate]}>Date</Text>
          <Text style={[s.headText, s.ledgerColDesc]}>Description</Text>
          <Text style={[s.headText, s.ledgerColCat]}>Category</Text>
          <Text style={[s.headText, s.ledgerColAmt]}>Amount</Text>
        </View>
        {expenseLedger.length === 0 ? (
          <Text style={s.empty}>No expense entries.</Text>
        ) : (
          expenseLedger.map((row, i) => (
            <View key={i} style={s.ledgerRow}>
              <Text style={[s.cellText, s.ledgerColDate]}>{fmtDate(row.date)}</Text>
              <Text style={[s.cellText, s.ledgerColDesc]}>{row.description}</Text>
              <Text style={[s.cellText, s.ledgerColCat]}>{row.categoryLabel}</Text>
              <Text style={[s.cellBold, s.ledgerColAmt]}>{formatR(row.amount)}</Text>
            </View>
          ))
        )}
        <View style={s.catTotalRow}>
          <Text style={[s.cellBold, s.ledgerColDate]} />
          <Text style={[s.cellBold, s.ledgerColDesc]}>Total Expenses</Text>
          <Text style={[s.cellBold, s.ledgerColCat]} />
          <Text style={[s.cellBold, s.ledgerColAmt]}>{formatR(totalExpenses)}</Text>
        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Generated: {generatedAt} · Swift Designz · For accounting purposes only</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
