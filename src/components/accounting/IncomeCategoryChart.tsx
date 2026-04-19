"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface CategoryDataPoint {
  category: string;
  amount: number;
  pct: number;
}

interface Props {
  data: CategoryDataPoint[];
}

const COLORS = ["#30B0B0", "#22d3ee", "#34d399", "#a78bfa", "#f472b6", "#fb923c", "#facc15"];

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
      <p className="text-teal">{formatRand(d.amount)}</p>
      <p className="text-gray-400">{d.pct.toFixed(1)}% of total</p>
    </div>
  );
}

export default function IncomeCategoryChart({ data }: Props) {
  if (data.length === 0) return null;
  const sorted = [...data].sort((a, b) => b.amount - a.amount);

  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Income by Source (YTD)
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <XAxis
            type="number"
            tickFormatter={(v) => `R${(v / 100000).toFixed(0)}k`}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={130}
            tick={{ fontSize: 11, fill: "#d1d5db" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {sorted.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
