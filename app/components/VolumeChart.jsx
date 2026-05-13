"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useState } from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-xs shadow-xl">
        <p className="text-zinc-300 font-mono mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="mb-0.5">
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function VolumeChart({ data, loading }) {
  const [view, setView] = useState("total"); // total | sentiment

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
            News Volume
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">Articles published per day</p>
        </div>
        <div className="flex gap-1">
          {["total", "sentiment"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                view === v
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} barSize={8} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "#52525b", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} />
          {view === "total" ? (
            <>
              <Bar dataKey="total" name="Total" fill="#38bdf8" radius={[2, 2, 0, 0]} />
              <Bar dataKey="market_moving" name="Market Moving" fill="#facc15" radius={[2, 2, 0, 0]} />
            </>
          ) : (
            <>
              <Bar dataKey="positive" name="Positive" fill="#4ade80" radius={[2, 2, 0, 0]} stackId="s" />
              <Bar dataKey="negative" name="Negative" fill="#f87171" radius={[0, 0, 0, 0]} stackId="s" />
              <Bar dataKey="neutral" name="Neutral" fill="#71717a" radius={[2, 2, 0, 0]} stackId="s" />
            </>
          )}
          <Legend
            wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", color: "#71717a" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
