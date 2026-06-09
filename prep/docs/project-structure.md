# Project Structure

```
sachnetra-dashboard/
│
├── app/                            # Next.js App Router root
│   ├── layout.jsx                  # Root HTML shell — sets <html lang>, metadata, dark background
│   ├── page.jsx                    # Main dashboard page (client component)
│   │                               #   Fetches all widget data in parallel
│   │                               #   Composes all components into the page layout
│   │                               #   Auto-refresh every 5 minutes
│   │
│   ├── globals.css                 # Tailwind directives + custom .card class (frosted glass effect)
│   │
│   ├── components/                 # Reusable UI components (all "use client")
│   │   ├── OverviewCards.jsx       # 4 KPI cards (today's news, sentiment, market-moving, high-threat)
│   │   ├── VolumeChart.jsx         # Daily article volume bar chart with range selector
│   │   ├── SentimentTrend.jsx      # Daily avg sentiment line chart with range selector
│   │   ├── TopTickers.jsx          # Ranked list of most-mentioned NSE tickers
│   │   └── NewsTable.jsx           # Searchable/filterable news feed with detail slide-over panel
│   │
│   └── api/                        # Next.js API route handlers
│       ├── stats/route.js          # GET /api/stats — dashboard KPI numbers
│       ├── volume/route.js         # GET /api/volume?days=N — time-series article counts
│       ├── sentiment/route.js      # GET /api/sentiment?days=N — time-series sentiment scores
│       ├── tickers/route.js        # GET /api/tickers — top 15 NSE ticker mentions
│       └── news/route.js           # GET /api/news — paginated, filterable news feed
│
├── lib/
│   └── db.js                       # PostgreSQL connection pool (pg) + query helper function
│
├── prep/                           # Development notes and task files
│   ├── task-file                   # Internal task tracking (not part of the app)
│   └── docs/                       # THIS folder — full technical documentation
│
├── .env.example                    # Template for required environment variables
├── jsconfig.json                   # @/* path alias mapping to project root
├── next.config.js                  # Next.js config (currently empty — all defaults)
├── tailwind.config.js              # Tailwind content paths + dark mode via class
├── postcss.config.js               # PostCSS plugins: tailwindcss + autoprefixer
├── package.json                    # Dependencies + npm scripts
├── package-lock.json               # Lockfile
└── README.md                       # Quick-start guide
```

## Key Relationships

- `app/page.jsx` is the only page. It imports all components from `app/components/`.
- Each component calls its own API route via `fetch()` in a `useEffect`.
- API routes import the shared `query()` function from `lib/db.js`.
- `lib/db.js` reads `DATABASE_PUBLIC_URL` from the environment at startup.
- `app/globals.css` defines the `.card` utility class used by every component card container.
