"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface DonutDataPoint {
  category: string;
  value: number;
}

interface Props {
  data: DonutDataPoint[];
}

const CATEGORY_LABELS: Record<string, string> = {
  web_dev: "Web Dev",
  ecommerce: "E-commerce",
  apps: "Apps",
  training: "Training",
  consulting: "Consulting",
  investment: "Investment",
  other: "Other",
};

const CATEGORY_COLORS: string[] = [
  "#30B0B0",
  "#60a5fa",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
  "#6b7280",
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-400">{payload[0].name}</p>
      <p className="text-foreground font-medium">
        R{(payload[0].value / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default function RevenueDonutChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const displayData = data.map((d) => ({
    name: CATEGORY_LABELS[d.category] ?? d.category,
    value: d.value,
  }));

  return (
    <div className="glass-card p-5 h-full">
      <h2 className="text-sm font-semibold text-foreground mb-1">Income by Category</h2>
      <p className="text-xs text-gray-500 mb-4">Last 12 months</p>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No income data yet.</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {displayData.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-sm font-bold text-foreground">
                R{(total / 100).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1.5">
            {displayData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 min-w-0">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                />
                <span className="text-xs text-gray-400 truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
