# Add ai_summary and ai_meaning to Sachnetra Dashboard

## Only 2 files to edit

---

## File 1: `app/api/news/route.js`

### Change — Add new columns to SELECT query

Find:
```js
`SELECT
  id, headline, source_name, article_url,
  published_at, scraped_at,
  sentiment_score, sentiment_label,
  threat_level, event_category, event_type,
  is_market_moving, nse_tickers, sectors, companies,
  relevance_class
FROM india_news_signals
```

Replace with:
```js
`SELECT
  id, headline, source_name, article_url,
  published_at, scraped_at,
  sentiment_score, sentiment_label,
  threat_level, event_category, event_type,
  is_market_moving, nse_tickers, sectors, companies,
  relevance_class, ai_summary, ai_meaning
FROM india_news_signals
```

---

## File 2: `app/components/NewsTable.jsx`

### Change 1 — Add expandedId state

Find:
```js
const [debouncedSearch, setDebouncedSearch] = useState("");
```

Add this line directly below it:
```js
const [expandedId, setExpandedId] = useState(null);
```

### Change 2 — Make row clickable

Find:
```jsx
news.map((item) => (
  <tr
    key={item.id}
    className="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors group"
  >
```

Replace with:
```jsx
news.map((item) => (
  <>
    <tr
      key={item.id}
      className="border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
    >
```

### Change 3 — Add expanded row showing ai_summary and ai_meaning

Find:
```jsx
                </tr>
              ))
            )}
```

Replace with:
```jsx
                </tr>
                {expandedId === item.id && (item.ai_summary || item.ai_meaning) && (
                  <tr key={`${item.id}-expand`} className="border-b border-zinc-800/40 bg-zinc-900/60">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.ai_summary && (
                          <div>
                            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
                              AI Summary
                            </p>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              {item.ai_summary}
                            </p>
                          </div>
                        )}
                        {item.ai_meaning && (
                          <div>
                            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">
                              Market Meaning
                            </p>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              {item.ai_meaning}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))
          )}
```

---

## After Making Changes

```bash
npm run dev
```

## What Changes in the UI
- Click any news row → expands to show `ai_summary` and `ai_meaning`
- Click again → collapses
- Rows without both fields simply don't expand
