# Features

## 1. Sticky Header

Always visible at the top of the page.

- Sachnetra logo and application title
- "Last updated" timestamp showing when the dashboard data was last fetched
- Manual **Refresh** button — re-fetches all widget data on demand

---

## 2. Overview Cards (KPIs)

Four summary cards displayed in a row, each showing a key metric.

### Today's News
- Count of articles published today (IST calendar day)
- Secondary label: count for the last 7 days
- Helps gauge whether today is a busy or quiet news day

### Sentiment (7d)
- Percentage breakdown of positive / negative / neutral articles over the last 7 days
- Visual stacked bar (green / red / gray) showing relative proportions
- Lets you immediately see if the week has been bullish or bearish in tone

### Market Moving
- Number of articles flagged as market-moving signals today
- Color-coded yellow when count > 0 to draw attention
- Helps prioritize which news items may actually impact prices

### High Threat
- Count of articles with `threat_level = high` today
- Color-coded red when count > 0
- Surfaces critical risk alerts at a glance

---

## 3. Volume Chart

A bar chart of daily article counts, living in the left half of the charts row.

### View Modes (toggle buttons)
| Mode | What is shown |
|------|--------------|
| **Total** | Blue bars = total articles; orange bars = market-moving articles |
| **Sentiment** | Stacked bars: green (positive) + red (negative) + gray (neutral) |

### Range Selector
Buttons to change the lookback window:

| Button | Days |
|--------|------|
| 1W | 7 |
| 1M | 30 |
| 3M | 90 |
| 6M | 180 |
| 1Y | 365 |
| MAX | 1095 (3 years) |

### Tooltip
Hovering a bar shows the exact date and all counts for that day.

---

## 4. Sentiment Trend Chart

A line chart of the daily average FinBERT sentiment score, living in the right half of the charts row.

- **Y-axis range:** -1.0 (maximum bearish) to +1.0 (maximum bullish)
- **Reference lines:**
  - `0` — neutral baseline
  - `+0.1` — mild bullish threshold
  - `-0.1` — mild bearish threshold
- Tooltip shows exact score and a bullish/bearish/neutral label
- Uses the same range selector (1W / 1M / 3M / 6M / 1Y / MAX) as the Volume Chart

---

## 5. Top Tickers

A ranked list of the 15 most-mentioned NSE-listed stocks in the last 30 days, displayed in the leftmost column of the bottom section.

Each ticker row shows:
- **Rank number** (1–15)
- **Ticker symbol** (`.NS` suffix stripped for readability)
- **Mention count** represented as a proportional horizontal bar
- **Average sentiment score** with color coding:
  - Emerald (green) — positive average
  - Red — negative average
  - Gray — neutral average
- **Sentiment mini-bar** — stacked green/red/gray strip showing positive/negative/neutral breakdown

A small legend at the bottom explains color meanings.

---

## 6. News Feed Table

The main data consumption area, spanning three columns of the bottom section.

### Filter Bar
| Filter | Type | Behavior |
|--------|------|----------|
| Headline search | Text input | ILIKE search, 400 ms debounce |
| Sentiment | Dropdown | All / Positive / Negative / Neutral |
| Threat | Dropdown | All / High / Medium / Low / Info |
| Market Moving | Toggle/Dropdown | All / Yes / No |
| Date From | Date picker | Lower bound on `published_at` |
| Date To | Date picker | Upper bound on `published_at` |

### Table Columns
| Column | Content |
|--------|---------|
| Headline | Article title, truncated |
| Source | Publisher name |
| Published | Formatted date/time |
| Sentiment | Colored badge (Positive / Negative / Neutral) |
| Threat | Colored badge (High / Medium / Low / Info) |
| Tickers | Comma-separated NSE ticker symbols |
| Event | Event type classification |

### Pagination
- 20 rows per page
- **Prev / Next** buttons with current page indicator
- Total record count displayed

### Row Click — Detail Panel
Clicking any row opens a right-side slide-over panel with full article metadata:

- Headline (linked to original article URL)
- Source, publish date, event type, event category
- Sentiment score + threat level (color-coded badges)
- NSE tickers, sectors, companies
- AI-generated summary (if populated)
- Market meaning / impact analysis (if populated)
- **Read Full Article** button
- Dismiss by clicking the backdrop or pressing `Escape`
