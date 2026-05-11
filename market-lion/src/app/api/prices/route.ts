import { NextRequest, NextResponse } from "next/server";
import { ASSETS } from "@/data/assets";
import { fetchYahooQuote } from "@/lib/marketData";

export async function GET(req: NextRequest) {
  const sym = req.nextUrl.searchParams.get("symbol");
  if (sym) {
    const q = await fetchYahooQuote(sym);
    return NextResponse.json({ symbol: sym, ...q });
  }
  const out = await Promise.all(ASSETS.map(async a => ({ symbol: a.symbol, ...(await fetchYahooQuote(a.symbol)) })));
  return NextResponse.json({ items: out, ts: Date.now() });
}
