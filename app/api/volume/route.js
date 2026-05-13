import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  try {
    const result = await query(`
      SELECT
        DATE(published_at) as date,
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_market_moving = true) as market_moving,
        COUNT(*) FILTER (WHERE sentiment_label = 'positive') as positive,
        COUNT(*) FILTER (WHERE sentiment_label = 'negative') as negative,
        COUNT(*) FILTER (WHERE sentiment_label = 'neutral') as neutral
      FROM india_news_signals
      WHERE published_at >= NOW() - INTERVAL '${days} days'
        AND published_at IS NOT NULL
      GROUP BY DATE(published_at)
      ORDER BY date ASC
    `);

    return NextResponse.json(
      result.rows.map((row) => ({
        date: row.date,
        total: parseInt(row.total),
        market_moving: parseInt(row.market_moving),
        positive: parseInt(row.positive),
        negative: parseInt(row.negative),
        neutral: parseInt(row.neutral),
      }))
    );
  } catch (err) {
    console.error("Volume API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
