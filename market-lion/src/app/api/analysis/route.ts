import { NextRequest, NextResponse } from "next/server";
import { fetchYahooCandles } from "@/lib/marketData";
import { runAnalysis, syntheticCandles } from "@/lib/analysisEngine";
import { TIMEFRAMES, Timeframe } from "@/data/timeframes";
import { fetchEconomicCalendar } from "@/lib/feeds/calendar";
import { fetchAllNews } from "@/lib/feeds/rss";
import { fetchAllStatements } from "@/lib/feeds/tweets";
import { classify, votesFromPolarity } from "@/lib/feeds/aiAnalysis";

const yahooIntervalForTf: Record<Timeframe, string> = {
  "1M":"1m","5M":"5m","15M":"15m","30M":"30m","1H":"60m","4H":"60m"
};

async function buildFundamentalVotes(symbol: string): Promise<Partial<Record<Timeframe, number>>> {
  try {
    const assetCurrencies = symbol.split("/").map(x => x.toUpperCase());
    const [news, calendar, statements] = await Promise.all([
      fetchAllNews(),
      fetchEconomicCalendar(),
      fetchAllStatements(),
    ]);

    const allItems: Array<{ polarity: -1|0|1; importance: string }> = [
      ...news.map(n => ({
        polarity: classify(n.title),
        importance: n.importance || "LOW",
      })),
      ...calendar.map(e => ({
        polarity: classify(`${e.indicator} ${e.actual ?? ""} ${e.forecast ?? ""} ${e.previous ?? ""}`),
        importance: e.importance,
      })),
      ...statements.map(s => ({
        polarity: classify(s.text),
        importance: s.importance,
      })),
    ].filter(x => x.polarity !== 0);

    const votes: Record<Timeframe, number[]> = {} as any;
    for (const tf of TIMEFRAMES) votes[tf] = [];

    for (const item of allItems) {
      const v = votesFromPolarity(item.polarity, item.importance);
      for (const tf of TIMEFRAMES) {
        if (v[tf] !== undefined) votes[tf].push(v[tf]);
      }
    }

    const result: Partial<Record<Timeframe, number>> = {};
    for (const tf of TIMEFRAMES) {
      const arr = votes[tf];
      result[tf] = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    }
    return result;
  } catch {
    return {};
  }
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "XAU/USD";
  const liveOnly = req.nextUrl.searchParams.get("live") === "1";

  const candles: any = {};
  let used = "live";
  for (const tf of TIMEFRAMES) {
    const arr = await fetchYahooCandles(symbol, yahooIntervalForTf[tf], tf === "4H" ? "1mo" : "5d");
    candles[tf] = arr.length >= 30 ? arr.slice(-200) : (liveOnly ? [] : syntheticCandles(99, 200, 2050));
    if (!arr.length) used = "synthetic";
  }

  // Fetch real fundamental votes in parallel (non-blocking — if it fails, engine uses neutral)
  const fundamentalVotes = await buildFundamentalVotes(symbol);

  const result = runAnalysis(candles, fundamentalVotes);
  return NextResponse.json({ symbol, source: used, ...result });
}
