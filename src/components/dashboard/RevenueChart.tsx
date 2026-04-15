"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface RevenueDataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface Props {
  data: RevenueDataPoint[];
}

function formatRand(cents: number) {
  if (cents >= 100000) return `R${(cents / 100000).toFixed(1)}k`;
  return `R${(cents / 100).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1 shadow-lg">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {`R${(p.value / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`}
        </p>
      ))}
    </div>
  );
}

export default function RevenueChart({ data }: Props) {
  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">Revenue Trend (12 months)</h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#30B0B0" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#30B0B0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatRand}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: "#9ca3af", fontSize: 11 }}>{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#30B0B0"
              strokeWidth={2}
              fill="url(#incomeGrad)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="#f87171"
              strokeWidth={2}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
