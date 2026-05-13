"use client";
import { useState, useEffect, useCallback } from "react";

const SENTIMENT_COLORS = {
  positive: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  negative: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  neutral: { bg: "bg-zinc-700/40", text: "text-zinc-400", border: "border-zinc-700" },
};

const THREAT_COLORS = {
  high: { bg: "bg-red-500/10", text: "text-red-400" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400" },
  low: { bg: "bg-sky-500/10", text: "text-sky-400" },
  info: { bg: "bg-zinc-700/40", text: "text-zinc-400" },
};

function Badge({ label, colorMap }) {
  if (!label) return null;
  const c = colorMap[label] || colorMap["info"] || { bg: "bg-zinc-800", text: "text-zinc-400" };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono ${c.bg} ${c.text}`}>
      {label}
    </span>
  );
}

function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Search headlines..."
        value={filters.search}
        onChange={(e) => onChange("search", e.target.value)}
        className="flex-1 min-w-48 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-sky-500/50 font-mono"
      />

      <select
        value={filters.sentiment}
        onChange={(e) => onChange("sentiment", e.target.value)}
        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-sky-500/50 font-mono"
      >
        <option value="">All Sentiment</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="neutral">Neutral</option>
      </select>

      <select
        value={filters.threat}
        onChange={(e) => onChange("threat", e.target.value)}
        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-sky-500/50 font-mono"
      >
        <option value="">All Threats</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="info">Info</option>
      </select>

      <label className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 cursor-pointer hover:border-zinc-600 transition-colors">
        <input
          type="checkbox"
          checked={filters.market_moving}
          onChange={(e) => onChange("market_moving", e.target.checked)}
          className="accent-yellow-400"
        />
        <span className="text-sm text-zinc-300 font-mono whitespace-nowrap">⚡ Market Moving</span>
      </label>

      <input
        type="date"
        value={filters.date_from}
        onChange={(e) => onChange("date_from", e.target.value)}
        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-sky-500/50 font-mono"
      />
      <input
        type="date"
        value={filters.date_to}
        onChange={(e) => onChange("date_to", e.target.value)}
        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-sky-500/50 font-mono"
      />

      <button
        onClick={onReset}
        className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

const DEFAULT_FILTERS = {
  search: "",
  sentiment: "",
  threat: "",
  market_moving: false,
  date_from: "",
  date_to: "",
};

export default function NewsTable() {
  const [news, setNews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 20,
        search: debouncedSearch,
        sentiment: filters.sentiment,
        threat: filters.threat,
        market_moving: filters.market_moving ? "true" : "",
        date_from: filters.date_from,
        date_to: filters.date_to,
        sort_by: "published_at",
        sort_dir: "desc",
      });
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      setNews(data.data || []);
      setPagination(data.pagination || { page: 1, total: 0, totalPages: 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.sentiment, filters.threat, filters.market_moving, filters.date_from, filters.date_to]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.sentiment, filters.threat, filters.market_moving, filters.date_from, filters.date_to]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleString("en-IN", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-sm font-mono text-zinc-400 uppercase tracking-widest">
          News Feed
        </h2>
        <p className="text-xs text-zinc-600 mt-0.5">
          {pagination.total.toLocaleString()} articles · page {pagination.page} of {pagination.totalPages}
        </p>
      </div>

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}
      />

      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800">
              {["Headline", "Source", "Published", "Sentiment", "Threat", "Tickers", "Event"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left font-mono text-zinc-600 uppercase tracking-wider text-xs whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i} className="border-b border-zinc-800/50">
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 bg-zinc-800 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : news.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-zinc-600 font-mono">
                  No news found for the selected filters
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors group"
                >
                  <td className="px-4 py-3 max-w-xs">
                    <div className="flex items-start gap-2">
                      {item.is_market_moving && (
                        <span className="text-yellow-400 shrink-0 mt-0.5">⚡</span>
                      )}
                      {item.article_url ? (
                        <a
                          href={item.article_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-200 hover:text-sky-400 transition-colors line-clamp-2 leading-relaxed"
                        >
                          {item.headline}
                        </a>
                      ) : (
                        <span className="text-zinc-200 line-clamp-2 leading-relaxed">
                          {item.headline}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-500 font-mono">
                    {item.source_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-500 font-mono">
                    {formatDate(item.published_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Badge label={item.sentiment_label} colorMap={SENTIMENT_COLORS} />
                      {item.sentiment_score != null && (
                        <span className="text-zinc-600 font-mono">
                          {parseFloat(item.sentiment_score) > 0 ? "+" : ""}
                          {parseFloat(item.sentiment_score).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge label={item.threat_level} colorMap={THREAT_COLORS} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(item.nse_tickers || []).slice(0, 3).map((t) => (
                        <span key={t} className="text-xs font-mono text-sky-400/80 bg-sky-500/10 px-1.5 py-0.5 rounded">
                          {t.replace(".NS", "")}
                        </span>
                      ))}
                      {(item.nse_tickers || []).length > 3 && (
                        <span className="text-zinc-600 font-mono text-xs">
                          +{item.nse_tickers.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-zinc-500 font-mono">
                    {item.event_type || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
        <span className="text-xs text-zinc-600 font-mono">
          Showing {Math.min((page - 1) * 20 + 1, pagination.total)}–
          {Math.min(page * 20, pagination.total)} of {pagination.total.toLocaleString()}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs font-mono bg-zinc-800 text-zinc-400 rounded-md disabled:opacity-30 hover:bg-zinc-700 transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page >= pagination.totalPages}
            className="px-3 py-1.5 text-xs font-mono bg-zinc-800 text-zinc-400 rounded-md disabled:opacity-30 hover:bg-zinc-700 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
