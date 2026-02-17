"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface TrendPoint {
  date: string;
  score: number;
}

export function TrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length < 2) return null;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
      <h3 className="text-sm font-medium text-zinc-300 mb-3">Score Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
