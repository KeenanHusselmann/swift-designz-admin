"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface CashFlowDataPoint {
  month: string;
  cashIn: number;
  cashOut: number;
  netFlow: number;
  cumulative: number;
}

function fmt(cents: number) {
  return `R${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as CashFlowDataPoint;
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-teal">In: {fmt(d.cashIn)}</p>
      <p className="text-red-400">Out: {fmt(d.cashOut)}</p>
      <p className={`font-medium ${d.netFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
        Net: {d.netFlow < 0 ? "-" : ""}{fmt(Math.abs(d.netFlow))}
      </p>
      <p className="text-amber-400">Cumulative: {fmt(d.cumulative)}</p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  const labels: Record<string, string> = { cashIn: "Cash In", cashOut: "Cash Out", cumulative: "Cumulative" };
  return (
    <ul className="flex gap-5 justify-center mt-2">
      {payload.map((entry: { color: string; dataKey: string }, i: number) => (
        <li key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          {labels[entry.dataKey] ?? entry.dataKey}
        </li>
      ))}
    </ul>
  );
}

export default function CashFlowChart({ data }: { data: CashFlowDataPoint[] }) {
  const hasData = data.some((d) => d.cashIn > 0 || d.cashOut > 0);
  if (!hasData) return null;

  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Cash Flow — 12 Months
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="bars"
            tickFormatter={(v) => `R${(v / 100000).toFixed(0)}k`}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={46}
          />
          <YAxis
            yAxisId="line"
            orientation="right"
            tickFormatter={(v) => `R${(v / 100000).toFixed(0)}k`}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={46}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Bar
            yAxisId="bars"
            dataKey="cashIn"
            fill="#30B0B0"
            opacity={0.85}
            radius={[3, 3, 0, 0]}
            maxBarSize={30}
          />
          <Bar
            yAxisId="bars"
            dataKey="cashOut"
            fill="#ef4444"
            opacity={0.75}
            radius={[3, 3, 0, 0]}
            maxBarSize={30}
          />
          <Line
            yAxisId="line"
            type="monotone"
            dataKey="cumulative"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#f59e0b" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
