"use client";
import { useState, useEffect } from "react";
import OverviewCards from "./components/OverviewCards";
import VolumeChart from "./components/VolumeChart";
import SentimentTrend from "./components/SentimentTrend";
import TopTickers from "./components/TopTickers";
import NewsTable from "./components/NewsTable";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [volume, setVolume] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [tickers, setTickers] = useState(null);
  const [loading, setLoading] = useState({ stats: true, volume: true, sentiment: true, tickers: true });
  const [days, setDays] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(null);

  const normalizeArray = (value) => (Array.isArray(value) ? value : []);
  const normalizeObject = (value) =>
    value && typeof value === "object" && !Array.isArray(value) && !value.error ? value : null;

  const fetchAll = async (d = days) => {
    setLoading({ stats: true, volume: true, sentiment: true, tickers: true });

    const [s, v, sent, t] = await Promise.allSettled([
      fetch("/api/stats").then((r) => r.json()),
      fetch(`/api/volume?days=${d}`).then((r) => r.json()),
      fetch(`/api/sentiment?days=${d}`).then((r) => r.json()),
      fetch("/api/tickers").then((r) => r.json()),
    ]);

    if (s.status === "fulfilled") setStats(normalizeObject(s.value));
    if (v.status === "fulfilled") setVolume(normalizeArray(v.value));
    if (sent.status === "fulfilled") setSentiment(normalizeArray(sent.value));
    if (t.status === "fulfilled") setTickers(normalizeArray(t.value));

    setLoading({ stats: false, volume: false, sentiment: false, tickers: false });
    setLastUpdated(new Date());
  };

  useEffect(() => { fetchAll(days); }, [days]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => fetchAll(days), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [days]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/60 sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
              <span className="text-sky-400 text-sm">⚡</span>
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-zinc-100 tracking-tight">
                SACHNETRA
              </h1>
              <p className="text-xs text-zinc-600 font-mono">market signal intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-zinc-600 font-mono hidden sm:block">
                updated {lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}

            <div className="flex gap-1">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                    days === d
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>

            <button
              onClick={() => fetchAll(days)}
              className="px-3 py-1.5 text-xs font-mono bg-zinc-800 text-zinc-400 rounded-md hover:bg-zinc-700 hover:text-zinc-200 transition-all"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">
        {/* Overview Cards */}
        <OverviewCards data={stats} loading={loading.stats} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VolumeChart data={volume} loading={loading.volume} />
          <SentimentTrend data={sentiment} loading={loading.sentiment} />
        </div>

        {/* Tickers + Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TopTickers data={tickers} loading={loading.tickers} />
          </div>
          <div className="lg:col-span-3">
            <NewsTable />
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800/40 mt-12">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-zinc-700 font-mono">sachnetra · india_news_signals</span>
          <span className="text-xs text-zinc-700 font-mono">finbert · groq</span>
        </div>
      </footer>
    </div>
  );
}
