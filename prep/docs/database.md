# Database

## Connection

The app connects to a **Railway-hosted PostgreSQL** instance via the `pg` (node-postgres) library.

Connection is configured in [lib/db.js](../../lib/db.js) using a pool:

```
Max connections:    10
Idle timeout:       30 seconds
Connection timeout:  5 seconds
SSL:                enabled in production
```

The connection string is read from `process.env.DATABASE_PUBLIC_URL`.

A single exported `query(text, params)` helper wraps `pool.query()` for all API routes.

---

## Table: `india_news_signals`

This is the single source of truth for all dashboard data. The schema below is inferred from the API query patterns.

### Columns

| Column | PostgreSQL Type | Description |
|--------|----------------|-------------|
| `id` | integer / serial | Primary key |
| `headline` | text | Article title |
| `article_url` | text | URL to the original article |
| `source_name` | text | Publisher / news source name |
| `published_at` | timestamptz | Publication time with timezone |
| `scraped_at` | timestamptz | When the article was scraped/ingested |
| `sentiment_score` | numeric | FinBERT score, range -1.0 to +1.0 |
| `sentiment_label` | text | `'positive'`, `'negative'`, or `'neutral'` |
| `threat_level` | text | `'high'`, `'medium'`, `'low'`, or `'info'` (may include `threat_level_` prefix in some rows) |
| `is_market_moving` | boolean | True if the article is flagged as a market-moving signal |
| `nse_tickers` | text[] | PostgreSQL array of NSE ticker symbols (e.g., `{RELIANCE.NS,TCS.NS}`) |
| `sectors` | text[] | Array of economic sectors covered |
| `companies` | text[] | Array of company names mentioned |
| `event_type` | text | Event classification (e.g., `'Earnings'`, `'Merger'`) |
| `event_category` | text | Broader category (e.g., `'Corporate'`, `'Macro'`) |
| `ai_summary` | text | AI-generated article summary (nullable) |
| `ai_meaning` | text | AI-generated market impact analysis (nullable) |
| `relevance_class` | text | Relevance classification (e.g., `'high'`, `'medium'`) |

### Indexes (Recommended)

The following indexes would improve query performance (not confirmed to exist, but implied by query patterns):

| Column | Reason |
|--------|--------|
| `published_at` | Used in almost every WHERE clause and ORDER BY |
| `sentiment_label` | Filtered in /api/news |
| `threat_level` | Filtered in /api/news |
| `is_market_moving` | Filtered in /api/news and counted in /api/stats |
| `nse_tickers` | Used with GIN index for UNNEST-based aggregation in /api/tickers |

---

## Timezone Handling

All "today" calculations use `AT TIME ZONE 'Asia/Kolkata'` to ensure the day boundary is correct for Indian Standard Time (IST = UTC+5:30).

Example pattern used in stats queries:
```sql
WHERE (published_at AT TIME ZONE 'Asia/Kolkata')::date = CURRENT_DATE AT TIME ZONE 'Asia/Kolkata'
```

---

## Data Ingestion

The ingestion pipeline is **external to this dashboard**. The dashboard is read-only. Based on column names, the pipeline likely:

1. Scrapes Indian financial news sources
2. Runs FinBERT for sentiment analysis → populates `sentiment_score`, `sentiment_label`
3. Runs a threat classification model → populates `threat_level`, `is_market_moving`
4. Runs NER / classification → populates `nse_tickers`, `sectors`, `companies`, `event_type`, `event_category`, `relevance_class`
5. Calls an LLM (likely Groq based on README references) → populates `ai_summary`, `ai_meaning`
6. Inserts the completed row into `india_news_signals`
