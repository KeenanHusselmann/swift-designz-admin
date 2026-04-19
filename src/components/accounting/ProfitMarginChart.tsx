"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

export interface MarginDataPoint {
  month: string;
  margin: number;
  income: number;
  net: number;
}

interface Props {
  data: MarginDataPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as MarginDataPoint;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className={d.margin >= 0 ? "text-teal" : "text-red-400"}>
        Margin: {d.margin.toFixed(1)}%
      </p>
      <p className="text-gray-400">
        Net: R{(d.net / 100).toLocaleString("en-ZA", { minimumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export default function ProfitMarginChart({ data }: Props) {
  const hasData = data.some((d) => d.income > 0);
  if (!hasData) return null;

  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Profit Margin Trend (12 Months)
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="margin"
            stroke="#30B0B0"
            strokeWidth={2}
            dot={{ r: 3, fill: "#30B0B0", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#30B0B0" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
