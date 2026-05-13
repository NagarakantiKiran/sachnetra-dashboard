"use client";

function SentimentBar({ positive, negative, neutral, total }) {
  const pct = (n) => Math.round((n / total) * 100);
  return (
    <div className="flex h-1 rounded-full overflow-hidden gap-px w-24">
      <div className="bg-emerald-400" style={{ width: `${pct(positive)}%` }} />
      <div className="bg-red-400" style={{ width: `${pct(negative)}%` }} />
      <div className="bg-zinc-600" style={{ width: `${pct(neutral)}%` }} />
    </div>
  );
}

export default function TopTickers({ data, loading }) {
  if (loading) {
    return (
      <div className="card">
        <div className="h-4 bg-zinc-700 rounded w-32 mb-6 animate-pulse" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const tickers = data || [];

  const scoreColor = (score) => {
    if (score > 0.1) return "#4ade80";
    if (score < -0.1) return "#f87171";
    return "#71717a";
  };

  const maxMentions = Math.max(...tickers.map((t) => t.mention_count), 1);

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
          Top Tickers
        </h2>
        <p className="text-xs text-zinc-600 mt-0.5">Most mentioned · last 30 days</p>
      </div>

      <div className="space-y-3">
        {tickers.length === 0 && (
          <p className="text-zinc-600 text-xs text-center py-8">No ticker data found</p>
        )}
        {tickers.map((t, i) => (
          <div key={t.ticker} className="flex items-center gap-3 group">
            <span className="text-zinc-700 font-mono text-xs w-4">{i + 1}</span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-zinc-200 truncate">
                  {t.ticker.replace(".NS", "")}
                </span>
                <span
                  className="text-xs font-mono font-bold ml-2 shrink-0"
                  style={{ color: scoreColor(t.avg_sentiment) }}
                >
                  {t.avg_sentiment > 0 ? "+" : ""}
                  {t.avg_sentiment.toFixed(3)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Mention bar */}
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500/60 rounded-full transition-all"
                    style={{ width: `${(t.mention_count / maxMentions) * 100}%` }}
                  />
                </div>
                <SentimentBar
                  positive={t.positive_count}
                  negative={t.negative_count}
                  neutral={t.neutral_count}
                  total={t.mention_count}
                />
                <span className="text-zinc-600 text-xs font-mono shrink-0">
                  {t.mention_count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800 flex gap-4 text-xs text-zinc-600 font-mono">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> pos
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> neg
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" /> neu
        </span>
      </div>
    </div>
  );
}
