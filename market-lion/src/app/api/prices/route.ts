import { NextRequest, NextResponse } from "next/server";
import { ASSETS } from "@/data/assets";
import { fetchYahooQuote, fetchYahooCandles } from "@/lib/marketData";

// ATR-based volatility from recent candles
async function computeATR(symbol: string, tf = "15m", period = 14): Promise<number> {
  const candles = await fetchYahooCandles(symbol, tf, "5d");
  if (candles.length < period + 1) return 15;
  let atrSum = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].h - candles[i].l,
      Math.abs(candles[i].h - candles[i - 1].c),
      Math.abs(candles[i].l - candles[i - 1].c),
    );
    atrSum += tr;
  }
  return atrSum / period;
}

export async function GET(req: NextRequest) {
  const sym = req.nextUrl.searchParams.get("symbol");
  if (sym) {
    const [q, atr] = await Promise.all([fetchYahooQuote(sym), computeATR(sym)]);
    return NextResponse.json({ symbol: sym, ...q, atr }, { headers: { "Cache-Control": "no-store" } });
  }
  const out = await Promise.all(ASSETS.map(async a => ({ symbol: a.symbol, ...(await fetchYahooQuote(a.symbol)) })));
  return NextResponse.json({ items: out, ts: Date.now() });
}
