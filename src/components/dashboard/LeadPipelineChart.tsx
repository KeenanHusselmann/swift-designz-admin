"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface LeadStatusDataPoint {
  status: string;
  count: number;
}

interface Props {
  data: LeadStatusDataPoint[];
}

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#30B0B0",
  contacted: "#2a9a9a",
  qualified: "#60a5fa",
  proposal: "#a78bfa",
  won: "#34d399",
  lost: "#f87171",
};

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs shadow-lg">
      <p className="text-gray-400">{label}</p>
      <p className="text-foreground font-medium">{payload[0].value} leads</p>
    </div>
  );
}

export default function LeadPipelineChart({ data }: Props) {
  const displayData = data.map((d) => ({
    ...d,
    label: STATUS_LABELS[d.status] ?? d.status,
  }));

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">Lead Pipeline</h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No leads yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#2a2a2a" }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
              {displayData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] ?? "#30B0B0"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
