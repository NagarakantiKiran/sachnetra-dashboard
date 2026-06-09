# Overview

## What Is Sachnetra Dashboard?

Sachnetra Dashboard is a real-time Indian financial news intelligence platform. It aggregates news articles about Indian markets (NSE-listed companies), runs them through FinBERT sentiment analysis and AI-powered summarization, and surfaces actionable signals on a single-page dashboard.

The intended audience is traders, analysts, or anyone who needs to quickly understand how the news cycle is affecting Indian equities sentiment.

## Core Purpose

- Monitor the daily volume and tone of Indian market news
- Spot which NSE-listed stocks are getting the most media attention
- Identify high-threat or market-moving events before they move prices
- Browse, search, and filter the full news feed with one-click deep-dives

## High-Level Architecture

```
                    ┌─────────────────────────────┐
                    │   Railway PostgreSQL DB      │
                    │   (india_news_signals table) │
                    └────────────┬────────────────┘
                                 │ pg (node-postgres)
                    ┌────────────▼────────────────┐
                    │   Next.js 14 API Routes      │
                    │   /api/stats                 │
                    │   /api/volume                │
                    │   /api/sentiment             │
                    │   /api/tickers               │
                    │   /api/news                  │
                    └────────────┬────────────────┘
                                 │ fetch()
                    ┌────────────▼────────────────┐
                    │   React Client Components    │
                    │   (page.jsx + components/)   │
                    └────────────┬────────────────┘
                                 │
                    ┌────────────▼────────────────┐
                    │   Browser (dark-mode UI)     │
                    │   Charts · Table · Panels    │
                    └─────────────────────────────┘
```

## Key Characteristics

- **Single-page app** — all widgets live on one URL (`/`)
- **Real-time** — auto-refreshes every 5 minutes; manual refresh button in header
- **India-specific** — all timezone handling uses IST (Asia/Kolkata)
- **No authentication** — assumes internal/trusted network or upstream gateway
- **Read-only UI** — dashboard consumes data only; no write operations from the UI
