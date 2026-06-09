# API Routes

All routes live under `app/api/` and are Next.js App Router route handlers.
All routes are `GET` only, return JSON, and are set to `force-dynamic` (no caching).

Base URL (local): `http://localhost:3000/api`

---

## GET /api/stats

**File:** [app/api/stats/route.js](../../app/api/stats/route.js)

Returns the dashboard overview KPIs.

### Query Parameters
None.

### Response Shape
```json
{
  "todayCount": 42,
  "weekCount": 210,
  "sentiment": {
    "positive": 38,
    "negative": 28,
    "neutral": 34
  },
  "marketMovingToday": 5,
  "highThreatToday": 2
}
```

### Notes
- Uses `AT TIME ZONE 'Asia/Kolkata'` to define "today" in IST
- Runs 5 parallel queries with `Promise.all`
- `sentiment` values are percentages (0–100), not raw counts

---

## GET /api/volume

**File:** [app/api/volume/route.js](../../app/api/volume/route.js)

Returns daily article counts time-series for the Volume Chart.

### Query Parameters
| Param | Type | Default | Valid Range | Description |
|-------|------|---------|-------------|-------------|
| `days` | integer | 30 | 1–1095 | How many days of history to return |

### Response Shape
```json
[
  {
    "date": "2024-01-15",
    "total": 87,
    "market_moving": 12,
    "positive": 35,
    "negative": 28,
    "neutral": 24
  }
]
```

### Notes
- Ordered by date ascending
- Uses PostgreSQL `FILTER (WHERE ...)` clause for conditional counting
- `days` is capped server-side: minimum 1, maximum 1095

---

## GET /api/sentiment

**File:** [app/api/sentiment/route.js](../../app/api/sentiment/route.js)

Returns daily average sentiment scores time-series for the Sentiment Trend Chart.

### Query Parameters
| Param | Type | Default | Valid Range | Description |
|-------|------|---------|-------------|-------------|
| `days` | integer | 30 | 1–1095 | How many days of history to return |

### Response Shape
```json
[
  {
    "date": "2024-01-15",
    "avg_score": 0.1234,
    "avg_positive": 0.4521,
    "avg_negative": -0.3102
  }
]
```

### Notes
- `avg_score` is the mean of `sentiment_score` across all articles that day
- Scores range from -1.0 (fully bearish) to +1.0 (fully bullish)
- Days with no articles are omitted (no zero-fill)

---

## GET /api/tickers

**File:** [app/api/tickers/route.js](../../app/api/tickers/route.js)

Returns the top 15 most-mentioned NSE tickers in the last 30 days.

### Query Parameters
None.

### Response Shape
```json
[
  {
    "ticker": "RELIANCE.NS",
    "mention_count": 143,
    "avg_sentiment": 0.0821,
    "positive_count": 62,
    "negative_count": 41,
    "neutral_count": 40
  }
]
```

### Notes
- Uses `UNNEST(nse_tickers)` to expand the PostgreSQL array into rows
- Excludes null/empty tickers
- Hardcoded to last 30 days and top 15 results
- Ordered by `mention_count DESC`

---

## GET /api/news

**File:** [app/api/news/route.js](../../app/api/news/route.js)

Returns a paginated, filterable list of news articles.

### Query Parameters
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 20 | Rows per page |
| `search` | string | — | Case-insensitive headline search (ILIKE) |
| `sentiment` | string | — | Filter by label: `positive`, `negative`, `neutral` |
| `threat` | string | — | Filter by threat level: `high`, `medium`, `low`, `info` |
| `market_moving` | string | — | `"true"` or `"false"` |
| `date_from` | string | — | ISO date string — lower bound on `published_at` |
| `date_to` | string | — | ISO date string — upper bound on `published_at` |
| `sort_by` | string | `published_at` | Column to sort by (whitelisted) |
| `sort_dir` | string | `desc` | `asc` or `desc` |

### Response Shape
```json
{
  "data": [
    {
      "id": 1,
      "headline": "Reliance Q3 profits beat estimates",
      "article_url": "https://...",
      "source_name": "Economic Times",
      "published_at": "2024-01-15T10:30:00+05:30",
      "sentiment_score": 0.7823,
      "sentiment_label": "positive",
      "threat_level": "low",
      "is_market_moving": true,
      "nse_tickers": ["RELIANCE.NS"],
      "sectors": ["Energy"],
      "companies": ["Reliance Industries"],
      "event_type": "Earnings",
      "event_category": "Corporate",
      "ai_summary": "...",
      "ai_meaning": "...",
      "relevance_class": "high"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 843,
    "totalPages": 43
  }
}
```

### Notes
- WHERE clauses are built dynamically with parameterized queries (no SQL injection risk)
- Allowed sort columns: `published_at`, `sentiment_score`, `threat_level`, `source_name`
- The `threat` filter matches against the raw `threat_level` column value (may include `threat_level_` prefix in DB — frontend normalizes for display)
- Two queries run per request: one for the data page, one for the total count

---

## Error Responses

All routes return HTTP 500 with a JSON body on database errors:

```json
{
  "error": "Internal server error"
}
```

Errors are also logged to `console.error` server-side.
