import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await query(`
      SELECT
        ticker,
        COUNT(*) as mention_count,
        ROUND(AVG(sentiment_score)::numeric, 4) as avg_sentiment,
        COUNT(*) FILTER (WHERE sentiment_label = 'positive') as positive_count,
        COUNT(*) FILTER (WHERE sentiment_label = 'negative') as negative_count,
        COUNT(*) FILTER (WHERE sentiment_label = 'neutral') as neutral_count
      FROM india_news_signals,
        UNNEST(nse_tickers) as ticker
      WHERE nse_tickers IS NOT NULL
        AND array_length(nse_tickers, 1) > 0
        AND published_at >= NOW() - INTERVAL '30 days'
      GROUP BY ticker
      ORDER BY mention_count DESC
      LIMIT 15
    `);

    return NextResponse.json(
      result.rows.map((row) => ({
        ticker: row.ticker,
        mention_count: parseInt(row.mention_count),
        avg_sentiment: parseFloat(row.avg_sentiment) || 0,
        positive_count: parseInt(row.positive_count),
        negative_count: parseInt(row.negative_count),
        neutral_count: parseInt(row.neutral_count),
      }))
    );
  } catch (err) {
    console.error("Tickers API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
