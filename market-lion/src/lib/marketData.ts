// Free open-source data connectors. No paid APIs by default.
// Yahoo Finance for prices/historical candles, FRED for economic indicators,
// Reuters/Bloomberg/CNBC RSS for news headlines.
import { ASSETS, Asset } from "@/data/assets";
import type { OHLCV } from "./types";

const YAHOO_BASE = process.env.YAHOO_FINANCE_BASE || "https://query1.finance.yahoo.com";

const YAHOO_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://finance.yahoo.com/",
  "Origin": "https://finance.yahoo.com",
};

async function yahooFetch(url: string, revalidate = 30): Promise<Response | null> {
  try {
    const res = await fetch(url, { headers: YAHOO_HEADERS, next: { revalidate } });
    if (res.ok) return res;
    // Fallback: alternate Yahoo endpoint
    const url2 = url.replace("query1.finance.yahoo.com", "query2.finance.yahoo.com");
    const res2 = await fetch(url2, { headers: YAHOO_HEADERS, next: { revalidate } });
    return res2.ok ? res2 : null;
  } catch { return null; }
}

export async function fetchYahooQuote(symbol: string): Promise<{ price: number; changePct: number; ts: number } | null> {
  try {
    const a = ASSETS.find(x => x.symbol === symbol);
    if (!a) return null;
    const url = `${YAHOO_BASE}/v7/finance/quote?symbols=${encodeURIComponent(a.yahoo)}`;
    const res = await yahooFetch(url, 5);
    if (!res) return null;
    const json: any = await res.json();
    const r = json?.quoteResponse?.result?.[0];
    if (!r) return null;
    return {
      price: r.regularMarketPrice ?? r.bid ?? r.ask ?? 0,
      changePct: r.regularMarketChangePercent ?? 0,
      ts: (r.regularMarketTime ?? Math.floor(Date.now()/1000)) * 1000,
    };
  } catch { return null; }
}

export async function fetchYahooCandles(symbol: string, interval = "15m", range = "5d"): Promise<OHLCV[]> {
  try {
    const a = ASSETS.find(x => x.symbol === symbol);
    if (!a) return [];
    const url = `${YAHOO_BASE}/v8/finance/chart/${encodeURIComponent(a.yahoo)}?interval=${interval}&range=${range}`;
    const res = await yahooFetch(url, 30);
    if (!res) return [];
    const j: any = await res.json();
    const r = j?.chart?.result?.[0];
    if (!r) return [];
    const ts: number[] = r.timestamp || [];
    const o = r.indicators?.quote?.[0]?.open || [];
    const h = r.indicators?.quote?.[0]?.high || [];
    const l = r.indicators?.quote?.[0]?.low || [];
    const c = r.indicators?.quote?.[0]?.close || [];
    const v = r.indicators?.quote?.[0]?.volume || [];
    const out: OHLCV[] = [];
    for (let i = 0; i < ts.length; i++) {
      if (o[i] == null) continue;
      out.push({ t: ts[i] * 1000, o: o[i], h: h[i], l: l[i], c: c[i], v: v[i] || 0 });
    }
    return out;
  } catch { return []; }
}

// Fetch news headlines from RSS (Reuters/CNBC/Bloomberg). Returns parsed titles only — no copyrighted excerpts.
export async function fetchHeadlines(): Promise<{ source: string; title: string; link: string; ts: number }[]> {
  const sources = [
    { name: "Reuters",   url: process.env.NEWS_RSS_REUTERS   || "https://feeds.reuters.com/reuters/businessNews" },
    { name: "Bloomberg", url: process.env.NEWS_RSS_BLOOMBERG || "https://feeds.bloomberg.com/markets/news.rss" },
    { name: "CNBC",      url: process.env.NEWS_RSS_CNBC      || "https://www.cnbc.com/id/100003114/device/rss/rss.html" },
  ];
  const out: { source: string; title: string; link: string; ts: number }[] = [];
  for (const s of sources) {
    try {
      const r = await fetch(s.url, { next: { revalidate: 60 } });
      if (!r.ok) continue;
      const xml = await r.text();
      const items = xml.split(/<item[^>]*>/i).slice(1, 11);
      for (const it of items) {
        const title = (it.match(/<title>(.*?)<\/title>/s)?.[1] || "").replace(/<!\[CDATA\[|]]>/g, "").trim();
        const link  = (it.match(/<link>(.*?)<\/link>/s)?.[1] || "").trim();
        out.push({ source: s.name, title, link, ts: Date.now() });
      }
    } catch {}
  }
  return out;
}
