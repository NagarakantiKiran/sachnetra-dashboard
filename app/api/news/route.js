import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const search = searchParams.get("search") || "";
  const sentiment = searchParams.get("sentiment") || "";
  const threat = searchParams.get("threat") || "";
  const marketMoving = searchParams.get("market_moving") || "";
  const dateFrom = searchParams.get("date_from") || "";
  const dateTo = searchParams.get("date_to") || "";
  const sortBy = searchParams.get("sort_by") || "published_at";
  const sortDir = searchParams.get("sort_dir") === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const values = [];
  let idx = 1;

  if (search) {
    conditions.push(`headline ILIKE $${idx++}`);
    values.push(`%${search}%`);
  }
  if (sentiment) {
    conditions.push(`sentiment_label = $${idx++}`);
    values.push(sentiment);
  }
  if (threat) {
    conditions.push(`threat_level = $${idx++}`);
    values.push(threat);
  }
  if (marketMoving === "true") {
    conditions.push(`is_market_moving = true`);
  }
  if (dateFrom) {
    conditions.push(`published_at >= $${idx++}`);
    values.push(dateFrom);
  }
  if (dateTo) {
    conditions.push(`published_at <= $${idx++}`);
    values.push(dateTo + "T23:59:59");
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const allowedSortCols = ["published_at", "scraped_at", "sentiment_score", "threat_level"];
  const safeSort = allowedSortCols.includes(sortBy) ? sortBy : "published_at";

  try {
    const [dataResult, countResult] = await Promise.all([
      query(
        `SELECT
          id, headline, source_name, article_url,
          published_at, scraped_at,
          sentiment_score, sentiment_label,
          threat_level, event_category, event_type,
          is_market_moving, nse_tickers, sectors, companies,
          relevance_class
        FROM india_news_signals
        ${whereClause}
        ORDER BY ${safeSort} ${sortDir}
        LIMIT ${limit} OFFSET ${offset}`,
        values
      ),
      query(
        `SELECT COUNT(*) as total FROM india_news_signals ${whereClause}`,
        values
      ),
    ]);

    return NextResponse.json({
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
      },
    });
  } catch (err) {
    console.error("News API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
