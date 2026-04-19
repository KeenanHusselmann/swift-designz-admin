"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface CategoryDataPoint {
  category: string;
  amount: number;
  pct: number;
}

interface Props {
  data: CategoryDataPoint[];
}

const COLORS = ["#f87171", "#fb923c", "#fbbf24", "#a78bfa", "#60a5fa", "#34d399", "#f472b6", "#94a3b8", "#e879f9"];

function formatRand(cents: number) {
  return `R${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as CategoryDataPoint;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-semibold text-foreground mb-1">{d.category}</p>
      <p className="text-red-400">{formatRand(d.amount)}</p>
      <p className="text-gray-400">{d.pct.toFixed(1)}% of total</p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
      {payload.map((entry: { color: string; value: string }, i: number) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </li>
      ))}
    </ul>
  );
}

export default function ExpenseCategoryChart({ data }: Props) {
  if (data.length === 0) return null;
  const sorted = [...data].sort((a, b) => b.amount - a.amount);

  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Expense Breakdown (YTD)
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={sorted}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={95}
            dataKey="amount"
            nameKey="category"
            paddingAngle={2}
            strokeWidth={0}
          >
            {sorted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
