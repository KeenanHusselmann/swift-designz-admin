---
name: Accounting Feature Roadmap
description: Planned accounting enhancements across 4 areas, starting with A
type: project
---

All 4 areas to be implemented in order:

**A (current)** — Deeper reporting: expense breakdown by category chart, income source analysis, profit margin trend, month-over-month % changes in P&L table
**B** — Cash flow tools: cash flow statement, projected cash position, invoice vs collected reconciliation
**C** — Tax-ready outputs: VAT summary, quarterly tax periods, printable accountant statement
**D** — Audit & reconciliation: search/filter entries by date range + category, flag large transactions, reference numbers on entries

**Why:** User wants accounting module to be a professional tool comfortable for bookkeepers, accountants, and investors.

**Excel export fix (cross-cutting):** Current CSV export is plain and unprofessional. Must be upgraded to a properly formatted, high-grade accounting document — proper headers, company branding, currency formatting, multi-sheet layout, column widths, subtotals. Target audience: bookkeepers, accountants, investors.

**How to apply:** Every time the export is touched or a new report is added, apply professional Excel formatting. Never ship a plain CSV as the primary export for accounting data.
