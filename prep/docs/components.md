# Components

All components live in [app/components/](../../app/components/) and are marked `"use client"` — they run in the browser and manage their own state.

---

## page.jsx

**Path:** [app/page.jsx](../../app/page.jsx)

The root dashboard page. It is itself a client component.

### Responsibilities
- Fetches data for all five widgets in parallel using `Promise.allSettled`
- Passes fetched data down as props to each component
- Runs an auto-refresh `setInterval` every 5 minutes
- Renders the sticky header and the full page layout (header, cards row, charts row, bottom row)

### State
| State var | Type | Purpose |
|-----------|------|---------|
| `stats` | object | Overview KPI numbers |
| `volumeData` | array | Daily volume time-series |
| `sentimentData` | array | Daily sentiment time-series |
| `tickers` | array | Top ticker data |
| `loading` | boolean | Whether initial fetch is in progress |
| `lastUpdated` | Date | Timestamp of last successful fetch |

---

## OverviewCards.jsx

**Path:** [app/components/OverviewCards.jsx](../../app/components/OverviewCards.jsx)

Renders the four KPI summary cards at the top of the dashboard.

### Props
| Prop | Type | Description |
|------|------|-------------|
| `stats` | object | Shape: `{ todayCount, weekCount, sentiment: {positive, negative, neutral}, marketMovingToday, highThreatToday }` |
| `loading` | boolean | When true, renders animated skeleton placeholders |

### Behavior
- Calculates percentage bars for sentiment breakdown client-side
- Colors market-moving count yellow when > 0, red for high-threat when > 0
- Shows loading skeletons (animated pulse) while data is fetching

---

## VolumeChart.jsx

**Path:** [app/components/VolumeChart.jsx](../../app/components/VolumeChart.jsx)

Bar chart of daily article volume with two view modes and a range selector.

### Props
| Prop | Type | Description |
|------|------|-------------|
| `data` | array | Array of `{ date, total, market_moving, positive, negative, neutral }` |
| `loading` | boolean | Shows loading skeleton when true |

### Internal State
| State var | Purpose |
|-----------|---------|
| `viewMode` | `"total"` or `"sentiment"` — controls which bars to render |
| `range` | Number of days to display (7, 30, 90, 180, 365, 1095) |

### Behavior
- Slices the `data` array to the selected range before rendering
- In **total** mode: renders two bar series (total + market_moving)
- In **sentiment** mode: renders a stacked bar chart (positive, negative, neutral)
- Custom tooltip component renders per-day breakdown on hover
- Wrapped in Recharts `ResponsiveContainer` for fluid sizing

---

## SentimentTrend.jsx

**Path:** [app/components/SentimentTrend.jsx](../../app/components/SentimentTrend.jsx)

Line chart of daily average FinBERT sentiment scores.

### Props
| Prop | Type | Description |
|------|------|-------------|
| `data` | array | Array of `{ date, avg_score, avg_positive, avg_negative }` |
| `loading` | boolean | Shows loading skeleton when true |

### Internal State
| State var | Purpose |
|-----------|---------|
| `range` | Number of days to display (same options as VolumeChart) |

### Behavior
- Y-axis is fixed to `[-1, 1]` — never auto-scales
- Reference lines drawn at 0, +0.1, -0.1 for visual context
- Tooltip shows exact score and interprets it as "Bullish" / "Bearish" / "Neutral"
- Same range selector buttons as VolumeChart

---

## TopTickers.jsx

**Path:** [app/components/TopTickers.jsx](../../app/components/TopTickers.jsx)

Ranked list of the 15 most-mentioned NSE stocks in the last 30 days.

### Props
| Prop | Type | Description |
|------|------|-------------|
| `tickers` | array | Array of `{ ticker, mention_count, avg_sentiment, positive_count, negative_count, neutral_count }` |
| `loading` | boolean | Shows loading skeleton when true |

### Behavior
- Strips `.NS` suffix from ticker symbols for display
- Renders a relative-width mention bar (proportional to the highest count in the list)
- Colors average sentiment score: emerald (≥ 0.05), red (≤ -0.05), gray (neutral range)
- Renders a stacked mini-bar per ticker showing sentiment breakdown
- Shows a color legend at the bottom of the card

---

## NewsTable.jsx

**Path:** [app/components/NewsTable.jsx](../../app/components/NewsTable.jsx)

The most complex component. Manages its own data fetching, filtering, pagination, and detail panel.

### Sub-components (defined within the same file)

| Sub-component | Purpose |
|--------------|---------|
| `FilterBar` | Search input + sentiment/threat/market-moving/date dropdowns |
| `Badge` | Reusable colored label for sentiment and threat levels |
| `DetailPanel` | Right slide-over showing full article metadata |

### Internal State
| State var | Purpose |
|-----------|---------|
| `news` | Array of news rows currently displayed |
| `pagination` | `{ page, limit, total, totalPages }` |
| `filters` | Object holding all active filter values |
| `loading` | Fetch in progress |
| `selectedItem` | The row object for the open detail panel (null = closed) |
| `searchInput` | Raw text input value (debounced before hitting API) |

### Data Fetching
- Fetches from `/api/news` whenever filters or pagination page changes
- `useCallback` memoizes the fetch function to prevent infinite re-render loops
- 400 ms debounce on the search input via `useEffect` + `setTimeout`

### Behavior
- Normalizes threat level strings (strips `"threat_level_"` prefix, lowercases)
- `Promise.allSettled` in page.jsx but NewsTable self-fetches — it does NOT receive data as props
- Detail panel traps `Escape` key via `useEffect` to close on keyboard navigation
- Backdrop click also closes the detail panel
