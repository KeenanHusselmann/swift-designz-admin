"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Props {
  data: { v: number }[];
  color?: string;
}

export default function SparklineChart({ data, color = "#30B0B0" }: Props) {
  if (data.length < 2) return null;
  return (
    <ResponsiveContainer width="100%" height={52}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
