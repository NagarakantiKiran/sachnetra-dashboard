import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [todayStats, weekStats, sentimentStats, marketMoving, threatHigh] =
      await Promise.all([
        // Total news today (IST aware)
        query(`
          SELECT COUNT(*) as count
          FROM india_news_signals
          WHERE published_at >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date
            AND published_at < (NOW() AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '1 day'
        `),
        // Total news this week
        query(`
          SELECT COUNT(*) as count
          FROM india_news_signals
          WHERE published_at >= date_trunc('week', NOW())
        `),
        // Sentiment breakdown (all time, last 7 days)
        query(`
          SELECT
            sentiment_label,
            COUNT(*) as count,
            ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
          FROM india_news_signals
          WHERE published_at >= NOW() - INTERVAL '7 days'
            AND sentiment_label IS NOT NULL
          GROUP BY sentiment_label
        `),
        // Market moving count today (IST aware)
        query(`
          SELECT COUNT(*) as count
          FROM india_news_signals
          WHERE is_market_moving = true
            AND published_at >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date
            AND published_at < (NOW() AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '1 day'
        `),
        // High threat level today (IST aware)
        query(`
          SELECT COUNT(*) as count
          FROM india_news_signals
          WHERE threat_level = 'high'
            AND published_at >= (NOW() AT TIME ZONE 'Asia/Kolkata')::date
            AND published_at < (NOW() AT TIME ZONE 'Asia/Kolkata')::date + INTERVAL '1 day'
        `),
      ]);

    const sentimentMap = {};
    sentimentStats.rows.forEach((row) => {
      sentimentMap[row.sentiment_label] = {
        count: parseInt(row.count),
        percentage: parseFloat(row.percentage),
      };
    });

    return NextResponse.json({
      todayCount: parseInt(todayStats.rows[0].count),
      weekCount: parseInt(weekStats.rows[0].count),
      sentiment: {
        positive: sentimentMap["positive"] || { count: 0, percentage: 0 },
        negative: sentimentMap["negative"] || { count: 0, percentage: 0 },
        neutral: sentimentMap["neutral"] || { count: 0, percentage: 0 },
      },
      marketMovingToday: parseInt(marketMoving.rows[0].count),
      highThreatToday: parseInt(threatHigh.rows[0].count),
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
