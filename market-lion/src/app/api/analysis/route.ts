import { NextRequest, NextResponse } from "next/server";
import { fetchYahooCandles } from "@/lib/marketData";
import { runAnalysis, syntheticCandles, syntheticCandlesAllTf } from "@/lib/analysisEngine";
import { TIMEFRAMES, Timeframe } from "@/data/timeframes";

const yahooIntervalForTf: Record<Timeframe, string> = {
  "1M":"1m","5M":"5m","15M":"15m","30M":"30m","1H":"60m","4H":"60m"
};

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
  const result = runAnalysis(candles);
  return NextResponse.json({ symbol, source: used, ...result });
}
