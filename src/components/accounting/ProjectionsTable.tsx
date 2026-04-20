"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import ProjectionEditForm from "./ProjectionEditForm";
import { formatCurrency } from "@/lib/utils";
import type { RevenueProjection } from "@/types/database";
import React from "react";

export interface MonthRow {
  month: string;       // YYYY-MM-01
  monthLabel: string;
  projection: RevenueProjection | null;
  actualIncome: number;    // cents
  actualExpenses: number;  // cents
}

export default function ProjectionsTable({ rows }: { rows: MonthRow[] }) {
  const [editingMonth, setEditingMonth] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Proj. Income</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Proj. Expenses</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Proj. Net</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actual Income</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actual Expenses</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actual Net</th>
            <th className="text-right py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Variance</th>
            <th className="py-3 px-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => {
            const proj = row.projection;
            const projIncome = proj?.projected_income ?? 0;
            const projExpenses = proj?.projected_expenses ?? 0;
            const projNet = projIncome - projExpenses;
            const actualNet = row.actualIncome - row.actualExpenses;
            const variance = actualNet - projNet;
            const hasActuals = row.actualIncome > 0 || row.actualExpenses > 0;
            const isEditing = editingMonth === row.month;

            return (
              <React.Fragment key={row.month}>
                <tr className={`transition-colors ${isEditing ? "bg-card/40" : "hover:bg-card/40"}`}>
                  <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">{row.monthLabel}</td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-teal">
                    {proj ? formatCurrency(projIncome) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-red-400/80">
                    {proj ? formatCurrency(projExpenses) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono text-sm font-medium ${projNet >= 0 ? "text-teal" : "text-red-400"}`}>
                    {proj ? formatCurrency(projNet) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-green-400">
                    {row.actualIncome > 0 ? formatCurrency(row.actualIncome) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm text-red-400/60">
                    {row.actualExpenses > 0 ? formatCurrency(row.actualExpenses) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono text-sm ${actualNet >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {hasActuals ? formatCurrency(actualNet) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono text-xs ${variance > 0 ? "text-green-400" : variance < 0 ? "text-red-400" : "text-gray-600"}`}>
                    {proj && hasActuals
                      ? `${variance >= 0 ? "+" : ""}${formatCurrency(variance)}`
                      : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setEditingMonth(isEditing ? null : row.month)}
                      className="p-1.5 rounded hover:bg-card text-gray-500 hover:text-teal transition-colors"
                      title={isEditing ? "Close" : "Edit projections"}
                    >
                      {isEditing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                </tr>
                {isEditing && (
                  <tr className="bg-card/40">
                    <td colSpan={9} className="px-4 py-4">
                      <ProjectionEditForm
                        month={row.month}
                        monthLabel={row.monthLabel}
                        currentIncome={projIncome}
                        currentExpenses={projExpenses}
                        onClose={() => setEditingMonth(null)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
