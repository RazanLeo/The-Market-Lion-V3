import { NextRequest, NextResponse } from "next/server";
import { ASSETS } from "@/data/assets";
import { fetchYahooQuote, fetchYahooCandles } from "@/lib/marketData";

export const revalidate = 30;
export const dynamic = "force-dynamic";

// In-memory cache of last-known-good prices — survives Yahoo rate limits
// because Yahoo returns 401 intermittently, but at least 1 of 9 usually works each cycle.
const priceCache: Map<string, { price: number; changePct: number; ts: number }> = new Map();
const atrCache: Map<string, { atr: number; ts: number }> = new Map();

async function computeATR(symbol: string, tf = "15m", period = 14): Promise<number> {
  const cached = atrCache.get(symbol);
  if (cached && Date.now() - cached.ts < 5 * 60_000) return cached.atr;  // 5 min cache
  const candles = await fetchYahooCandles(symbol, tf, "5d");
  if (candles.length < period + 1) return cached?.atr || 15;
  let atrSum = 0;
  for (let i = candles.length - period; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].h - candles[i].l,
      Math.abs(candles[i].h - candles[i - 1].c),
      Math.abs(candles[i].l - candles[i - 1].c),
    );
    atrSum += tr;
  }
  const atr = atrSum / period;
  atrCache.set(symbol, { atr, ts: Date.now() });
  return atr;
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

async function refreshQuote(symbol: string) {
  const q = await fetchYahooQuote(symbol);
  if (q && typeof q.price === "number" && q.price > 0) {
    priceCache.set(symbol, { price: q.price, changePct: q.changePct ?? 0, ts: q.ts });
    return q;
  }
  // Yahoo failed — return last-known-good (may be stale)
  return priceCache.get(symbol) ?? null;
}

export async function GET(req: NextRequest) {
  const sym = req.nextUrl.searchParams.get("symbol");
  if (sym) {
    const [q, atr] = await Promise.all([refreshQuote(sym), computeATR(sym)]);
    return NextResponse.json({ symbol: sym, ...(q || {}), atr }, { headers: { "Cache-Control": "no-store" } });
  }

  // Refresh each asset sequentially with delay — keep cache valid
  const out: any[] = [];
  for (const a of ASSETS) {
    const q = await refreshQuote(a.symbol);
    out.push({ symbol: a.symbol, ...(q || {}) });
    await delay(120);
  }
  return NextResponse.json({ items: out, ts: Date.now() }, { headers: { "Cache-Control": "no-store" } });
}
