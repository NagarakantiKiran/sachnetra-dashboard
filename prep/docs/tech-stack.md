# Tech Stack

## Framework

| Layer | Technology | Version | Role |
|-------|-----------|---------|------|
| Full-stack framework | Next.js | 14.2.3 | App Router, SSR, API routes |
| UI library | React | 18 | Component model |
| Database client | node-postgres (pg) | 8.11.5 | PostgreSQL queries |

## Frontend

| Library | Version | Why Used |
|---------|---------|----------|
| Recharts | 2.12.7 | Declarative, responsive charting (bar + line charts) |
| Tailwind CSS | 3.4.3 | Utility-first styling; keeps dark theme consistent |
| PostCSS | 8.4.38 | CSS processing pipeline |
| Autoprefixer | 10.4.19 | Vendor prefix injection |

## Backend / Infrastructure

| Service | Purpose |
|---------|---------|
| Railway PostgreSQL | Hosted database (production) |
| Vercel | Hosting for Next.js app (recommended) |

## Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 8 | Linting with Next.js ruleset |
| Node.js | 18+ | Runtime (implied by Next.js 14 requirements) |

## Notable Choices and Trade-offs

**No state management library (no Redux/Zustand/Context):**
React hooks (`useState`, `useEffect`) are sufficient. This keeps the bundle small and avoids boilerplate for a read-only, data-display app.

**Recharts over D3:**
Recharts provides declarative, React-native chart components. The trade-off is less customization flexibility, but the default behavior (responsive containers, tooltips, reference lines) matches what the dashboard needs.

**Next.js App Router with `force-dynamic`:**
All API routes opt out of caching (`export const dynamic = "force-dynamic"`). This ensures the dashboard always shows live data rather than stale cached responses.

**PostgreSQL native arrays:**
`nse_tickers`, `sectors`, and `companies` are stored as PostgreSQL arrays. This avoids a separate join table and lets the API use `UNNEST()` for aggregation queries.
