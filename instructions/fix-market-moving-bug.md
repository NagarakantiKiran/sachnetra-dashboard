# Fix: Market Moving Count Showing Yesterday's Data

## Problem
The "Market Moving Today" and "High Threat Today" cards in the Overview Cards
are showing yesterday's counts instead of today's. The bug is in the SQL queries
inside `app/api/stats/route.js` — they use `CURRENT_DATE` without timezone
context, causing a mismatch with IST (India Standard Time, UTC+5:30).

---

## File to Edit
```
app/api/stats/route.js
```

---

## Change 1 — Fix "Market Moving Today" query

Find this block:
```js
// Market moving count today
query(`
  SELECT COUNT(*) as count
  FROM india_news_signals
  WHERE is_market_moving = true
    AND published_at >= CURRENT_DATE
`),
```

Replace with:
```js
// Market moving count today (IST aware)
query(`
  SELECT COUNT(*) as count
  FROM india_news_signals
  WHERE is_market_moving = true
    AND published_at >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date
    AND published_at < (NOW() AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '1 day'
`),
```

---

## Change 2 — Fix "Total News Today" query

Find this block:
```js
// Total news today
query(`
  SELECT COUNT(*) as count
  FROM india_news_signals
  WHERE published_at >= CURRENT_DATE
    AND published_at < CURRENT_DATE + INTERVAL '1 day'
`),
```

Replace with:
```js
// Total news today (IST aware)
query(`
  SELECT COUNT(*) as count
  FROM india_news_signals
  WHERE published_at >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date
    AND published_at < (NOW() AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '1 day'
`),
```

---

## Change 3 — Fix "High Threat Today" query

Find this block:
```js
// High threat level today
query(`
  SELECT COUNT(*) as count
  FROM india_news_signals
  WHERE threat_level = 'high'
    AND published_at >= NOW() - INTERVAL '24 hours'
`),
```

Replace with:
```js
// High threat level today (IST aware)
query(`
  SELECT COUNT(*) as count
  FROM india_news_signals
  WHERE threat_level = 'high'
    AND published_at >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date
    AND published_at < (NOW() AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '1 day'
`),
```

---

## Why This Happens
Railway Postgres runs in UTC. India is UTC+5:30, so at midnight IST (6:30 PM UTC
the previous day), `CURRENT_DATE` in Postgres still returns yesterday's date.
Using `(NOW() AT TIME ZONE 'Asia/Kolkata')::date` converts the timestamp to IST
before truncating to a date, giving the correct "today" for Indian users.

---

## After Making Changes
Restart the dev server:
```bash
npm run dev
```
The Market Moving and High Threat cards will now correctly show only today's
(IST) counts.
