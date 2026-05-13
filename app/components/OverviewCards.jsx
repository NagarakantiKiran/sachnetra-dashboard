"use client";

export default function OverviewCards({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-zinc-700 rounded w-24 mb-3" />
            <div className="h-8 bg-zinc-700 rounded w-16 mb-2" />
            <div className="h-3 bg-zinc-800 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    {
      label: "Today's News",
      value: data.todayCount,
      sub: `${data.weekCount} this week`,
      icon: "📰",
      accent: "#38bdf8",
    },
    {
      label: "Sentiment (7d)",
      value: `${data.sentiment?.positive?.percentage ?? 0}%`,
      sub: `${data.sentiment?.negative?.percentage ?? 0}% negative · ${data.sentiment?.neutral?.percentage ?? 0}% neutral`,
      icon: "📊",
      accent: "#4ade80",
      sentimentBar: data.sentiment,
    },
    {
      label: "Market Moving",
      value: data.marketMovingToday,
      sub: "Today's signals",
      icon: "⚡",
      accent: "#facc15",
    },
    {
      label: "High Threat",
      value: data.highThreatToday,
      sub: "Last 24 hours",
      icon: "🚨",
      accent: data.highThreatToday > 0 ? "#f87171" : "#4ade80",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="card group">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              {card.label}
            </span>
            <span className="text-lg">{card.icon}</span>
          </div>

          <div
            className="text-3xl font-bold mb-1 tabular-nums"
            style={{ color: card.accent }}
          >
            {card.value}
          </div>

          {card.sentimentBar ? (
            <div className="mt-2">
              <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5 mb-1">
                <div
                  className="bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${card.sentimentBar.positive?.percentage ?? 0}%` }}
                />
                <div
                  className="bg-red-400 rounded-full transition-all"
                  style={{ width: `${card.sentimentBar.negative?.percentage ?? 0}%` }}
                />
                <div
                  className="bg-zinc-500 rounded-full transition-all"
                  style={{ width: `${card.sentimentBar.neutral?.percentage ?? 0}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500">{card.sub}</p>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
