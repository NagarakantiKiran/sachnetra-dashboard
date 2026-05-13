"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const score = payload[0]?.value;
    const color = score > 0 ? "#4ade80" : score < 0 ? "#f87171" : "#71717a";
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs shadow-xl">
        <p className="text-zinc-400 font-mono mb-2">{label}</p>
        <p style={{ color }} className="font-bold text-sm">
          {score > 0 ? "+" : ""}
          {score?.toFixed(4)}
        </p>
        <p className="text-zinc-500 mt-1">
          {score > 0.1 ? "Bullish" : score < -0.1 ? "Bearish" : "Neutral"}
        </p>
      </div>
    );
  }
  return null;
};

export default function SentimentTrend({ data, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="h-4 bg-zinc-700 rounded w-40 mb-6 animate-pulse" />
        <div className="h-48 bg-zinc-800 rounded animate-pulse" />
      </div>
    );
  }

  const formatted = (data || []).map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
          Sentiment Trend
        </h2>
        <p className="text-xs text-zinc-600 mt-0.5">Daily avg score · -1.0 bearish → +1.0 bullish</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[-1, 1]}
            tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            width={36}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#3f3f46" strokeDasharray="4 4" />
          <ReferenceLine y={0.1} stroke="#166534" strokeDasharray="2 4" strokeOpacity={0.4} />
          <ReferenceLine y={-0.1} stroke="#7f1d1d" strokeDasharray="2 4" strokeOpacity={0.4} />
          <Line
            type="monotone"
            dataKey="avg_score"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#38bdf8" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
