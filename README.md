# Sachnetra Dashboard

Market signal intelligence dashboard for `india_news_signals` — powered by FinBERT + Groq.

## Stack
- **Next.js 14** (App Router) — frontend + API routes
- **Tailwind CSS** — styling
- **Recharts** — charts
- **node-postgres (pg)** — Railway Postgres connection
- **Vercel** — free deployment

---

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variable
```bash
cp .env.example .env.local
```

Open `.env.local` and paste your Railway Postgres **Public URL**:
```
DATABASE_PUBLIC_URL=postgresql://user:password@host.railway.app:5432/railway
```

> **Where to find it:**
> Railway → your project → Postgres service → Connect tab → scroll to "Public URL"

### 3. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel (Free)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "init: sachnetra dashboard"
git remote add origin https://github.com/YOUR_USERNAME/sachnetra-dashboard.git
git push -u origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Add environment variable:
   - Key: `DATABASE_PUBLIC_URL`
   - Value: your Railway Public URL (same as `.env.local`)
5. Click **Deploy**

Done! Your dashboard is live on a free Vercel URL.

---

## Project Structure

```
sachnetra-dashboard/
├── app/
│   ├── page.jsx                  ← Main dashboard
│   ├── layout.jsx                ← Root layout
│   ├── globals.css               ← Tailwind + custom styles
│   ├── api/
│   │   ├── stats/route.js        ← Overview cards data
│   │   ├── news/route.js         ← News table + filters + pagination
│   │   ├── volume/route.js       ← Volume chart data
│   │   ├── sentiment/route.js    ← Sentiment trend data
│   │   └── tickers/route.js      ← Top tickers data
│   └── components/
│       ├── OverviewCards.jsx
│       ├── VolumeChart.jsx
│       ├── SentimentTrend.jsx
│       ├── TopTickers.jsx
│       └── NewsTable.jsx
├── lib/
│   └── db.js                     ← Postgres connection pool
├── .env.example
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## API Routes

| Route | Description | Query Params |
|---|---|---|
| `GET /api/stats` | Overview card numbers | — |
| `GET /api/volume` | News volume per day | `?days=30` |
| `GET /api/sentiment` | Avg sentiment score per day | `?days=30` |
| `GET /api/tickers` | Top 15 NSE tickers | — |
| `GET /api/news` | Paginated filterable news | `?page=1&search=&sentiment=&threat=&market_moving=&date_from=&date_to=` |

---

## Dashboard Features

- **Overview Cards** — Today's count, weekly count, sentiment split, market moving, high threat alerts
- **Volume Chart** — Daily article volume (total vs sentiment stacked view)
- **Sentiment Trend** — Daily average FinBERT score line chart
- **Top Tickers** — Most mentioned NSE tickers with per-ticker sentiment
- **News Table** — Searchable, filterable, paginated news feed with badges

---

## Troubleshooting

**`ECONNREFUSED` or connection error locally**
→ Make sure you're using the **Public URL** (not internal URL) in `.env.local`

**No data showing**
→ Check that `published_at` column has values (some rows may have `NULL` publish dates)

**Vercel deploy fails**
→ Check that `DATABASE_PUBLIC_URL` is set in Vercel → Project → Settings → Environment Variables
