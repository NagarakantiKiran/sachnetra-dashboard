# Data Flow

## Overview

Data flows in one direction: PostgreSQL → API Routes → React Components → Browser.

```
PostgreSQL (Railway)
    │
    │  node-postgres pool (lib/db.js)
    ▼
Next.js API Routes (app/api/)
    │
    │  fetch() from browser
    ▼
React Client Components
    │
    │  JSX rendering
    ▼
Browser DOM (dark-mode UI)
```

---

## Dashboard Initialization

When the page first loads (`app/page.jsx`):

1. `useEffect` fires on mount
2. `fetchAllData()` is called — runs these fetches in parallel with `Promise.allSettled`:
   - `fetch('/api/stats')`
   - `fetch('/api/volume?days=30')`
   - `fetch('/api/sentiment?days=30')`
   - `fetch('/api/tickers')`
3. Results are stored in separate state variables: `stats`, `volumeData`, `sentimentData`, `tickers`
4. `loading` is set to `false` and `lastUpdated` is set to `new Date()`
5. Props are passed down to `OverviewCards`, `VolumeChart`, `SentimentTrend`, `TopTickers`

**Note:** `NewsTable` does NOT receive data as props — it fetches independently.

---

## Auto-Refresh

In `page.jsx`, a `setInterval` runs `fetchAllData()` every **5 minutes** (300,000 ms).

The interval is cleared in the `useEffect` cleanup function to avoid memory leaks when the component unmounts.

The manual **Refresh** button in the header calls `fetchAllData()` immediately on click.

---

## NewsTable Data Fetching

`NewsTable.jsx` manages its own data lifecycle independently of the page.

1. On mount, `fetchNews()` is called with default filters (page 1, no filters)
2. Any change to filters or page number triggers a new `fetchNews()` call via `useEffect`
3. The fetch hits `/api/news` with query parameters built from current filter state
4. Results are stored in `news` (array) and `pagination` (object)

### Search Debounce

The search input has a 400 ms debounce to avoid firing an API call on every keystroke:

```
User types → searchInput state updates immediately (for UI responsiveness)
           → useEffect detects searchInput change
           → setTimeout(400ms) starts
           → If user types again within 400ms → previous timeout is cleared
           → After 400ms of no typing → filters.search is updated → fetch fires
```

---

## API Route Data Processing

Each API route follows this pattern:

```
Receive request
    │
    ▼
Parse and validate query parameters (clamp numbers, whitelist sort columns)
    │
    ▼
Build parameterized SQL query
    │
    ▼
Call query() from lib/db.js
    │
    ▼
Transform rows if needed (e.g., parse floats, build percentage values)
    │
    ▼
Return NextResponse.json(result)
```

---

## Data Normalization on the Frontend

Components normalize data defensively before rendering:

- **`normalizeArray(val)`** — returns `[]` if val is not an array (guards against API returning null/object on error)
- **`normalizeObject(val)`** — returns `{}` if val is not an object
- **Sentiment score** — parsed with `parseFloat(...).toFixed(4)` for consistent decimal display
- **Threat level** — `replace('threat_level_', '').toLowerCase()` strips any prefix the DB may include
- **Ticker symbols** — `.replace('.NS', '')` removes the exchange suffix for display

---

## Error Handling

| Layer | Behavior on Error |
|-------|-----------------|
| API route | Catches exception, returns `{ error: "Internal server error" }` with HTTP 500, logs to console |
| `page.jsx` | `Promise.allSettled` — individual widget failures don't block others; failed results leave state as previous value |
| Components | Render loading skeleton or empty state when data is missing/empty |
| NewsTable | Catches fetch errors, sets `news = []`, shows empty table |
