import { NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/feeds/rss";
import { fetchEconomicCalendar } from "@/lib/feeds/calendar";
import { fetchAllStatements } from "@/lib/feeds/tweets";
import { classify, votesFromPolarity, narrative } from "@/lib/feeds/aiAnalysis";

// Server route streams (well, responds with) the full fundamental feed for the dashboard.
// Cached at the edge for 30 seconds so concurrent users don't hammer upstream feeds.
export const revalidate = 30;

export async function GET() {
  const [news, calendar, statements] = await Promise.all([
    fetchAllNews(),
    fetchEconomicCalendar(),
    fetchAllStatements(),
  ]);

  // Annotate each item with AI polarity + per-tf vote + narrative.
  const newsRows = news.map(n => {
    const polarity = classify(n.title);
    return {
      ...n,
      polarity,
      votes: votesFromPolarity(polarity, n.importance || "LOW"),
      narrative: narrative(n.title, n.source, polarity, n.asset || "USD", n.importance || "LOW"),
    };
  });

  const calRows = calendar.map(e => {
    const polarity = classify(`${e.indicator} ${e.actual ?? ""} ${e.forecast ?? ""} ${e.previous ?? ""}`);
    return {
      ...e,
      polarity,
      votes: votesFromPolarity(polarity, e.importance),
      narrative: narrative(e.indicator, e.source, polarity, e.asset, e.importance),
    };
  });

  const stmtRows = statements.map(s => {
    const polarity = classify(s.text);
    return {
      ...s,
      polarity,
      votes: votesFromPolarity(polarity, s.importance),
      narrative: narrative(s.text, s.speaker + " · " + s.role, polarity, s.asset || "USD", s.importance),
    };
  });

  return NextResponse.json({
    ts: Date.now(),
    indicators: calRows.slice(0, 80),    // up to ~80 events from FF this week
    news: newsRows.slice(0, 50),
    statements: stmtRows.slice(0, 40),
  });
}
