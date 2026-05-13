import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");

  try {
    const result = await query(`
      SELECT
        DATE(published_at) as date,
        ROUND(AVG(sentiment_score)::numeric, 4) as avg_score,
        ROUND(AVG(sentiment_score) FILTER (WHERE sentiment_label = 'positive')::numeric, 4) as avg_positive,
        ROUND(AVG(sentiment_score) FILTER (WHERE sentiment_label = 'negative')::numeric, 4) as avg_negative
      FROM india_news_signals
      WHERE published_at >= NOW() - INTERVAL '${days} days'
        AND sentiment_score IS NOT NULL
        AND published_at IS NOT NULL
      GROUP BY DATE(published_at)
      ORDER BY date ASC
    `);

    return NextResponse.json(
      result.rows.map((row) => ({
        date: row.date,
        avg_score: parseFloat(row.avg_score) || 0,
        avg_positive: parseFloat(row.avg_positive) || 0,
        avg_negative: parseFloat(row.avg_negative) || 0,
      }))
    );
  } catch (err) {
    console.error("Sentiment trend API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
