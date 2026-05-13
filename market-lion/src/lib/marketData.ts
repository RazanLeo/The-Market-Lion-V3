// Free open-source data connectors. No paid APIs by default.
// Yahoo Finance for prices/historical candles, FRED for economic indicators,
// Reuters/Bloomberg/CNBC RSS for news headlines.
import { ASSETS } from "@/data/assets";
import type { OHLCV } from "./types";

const YAHOO_BASE = process.env.YAHOO_FINANCE_BASE || "https://query1.finance.yahoo.com";

// Minimal UA — Origin/Referer dropped intentionally: Docker egress IPs trigger Yahoo's
// anti-scraping when fake browser origin headers don't match the actual request path.
const YAHOO_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

async function yahooFetch(url: string): Promise<Response | null> {
  try {
    // cache: 'no-store' — Next.js must NOT cache 401/4xx responses from Yahoo.
    const res = await fetch(url, { headers: YAHOO_HEADERS, cache: "no-store" });
    if (res.ok) return res;
    // Fallback: alternate Yahoo endpoint
    const url2 = url.replace("query1.finance.yahoo.com", "query2.finance.yahoo.com");
    const res2 = await fetch(url2, { headers: YAHOO_HEADERS, cache: "no-store" });
    return res2.ok ? res2 : null;
  } catch { return null; }
}

// Optional: Twelvedata free tier (800 req/day). Set TWELVEDATA_KEY in .env.
// Symbol map: platform symbol → Twelvedata symbol
const TD_MAP: Record<string, string> = {
  "XAU/USD": "XAU/USD",
  "XTI/USD": "WTI/USD",
  "EUR/USD": "EUR/USD",
  "GBP/USD": "GBP/USD",
  "USD/JPY": "USD/JPY",
  "USD/CHF": "USD/CHF",
  "USD/CAD": "USD/CAD",
  "AUD/USD": "AUD/USD",
  "NZD/USD": "NZD/USD",
};

async function fetchTwelvedataQuote(symbol: string): Promise<{ price: number; changePct: number; ts: number } | null> {
  const key = process.env.TWELVEDATA_KEY;
  if (!key) return null;
  const tdSym = TD_MAP[symbol];
  if (!tdSym) return null;
  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(tdSym)}&apikey=${key}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const j: any = await res.json();
    if (j.status === "error" || !j.close) return null;
    const price = parseFloat(j.close);
    const changePct = parseFloat(j.percent_change ?? "0");
    return { price, changePct, ts: Date.now() };
  } catch { return null; }
}

export async function fetchYahooQuote(symbol: string): Promise<{ price: number; changePct: number; ts: number } | null> {
  try {
    const a = ASSETS.find(x => x.symbol === symbol);
    if (!a) return null;
    // /v7/finance/quote returns 401 for unauthenticated access since May 2024.
    // /v8/finance/chart meta object contains regularMarketPrice + previousClose.
    const url = `${YAHOO_BASE}/v8/finance/chart/${encodeURIComponent(a.yahoo)}?interval=1d&range=5d`;
    const res = await yahooFetch(url);
    if (!res) {
      // Yahoo failed from this container — try Twelvedata fallback
      return fetchTwelvedataQuote(symbol);
    }
    const json: any = await res.json();
    const r = json?.chart?.result?.[0];
    const m = r?.meta;
    if (!m) return fetchTwelvedataQuote(symbol);
    const price = m.regularMarketPrice ?? m.previousClose ?? 0;
    const prev  = m.chartPreviousClose ?? m.previousClose ?? price;
    const changePct = prev ? ((price - prev) / prev) * 100 : 0;
    return {
      price,
      changePct,
      ts: (m.regularMarketTime ?? Math.floor(Date.now() / 1000)) * 1000,
    };
  } catch { return fetchTwelvedataQuote(symbol); }
}

export async function fetchYahooCandles(symbol: string, interval = "15m", range = "5d"): Promise<OHLCV[]> {
  try {
    const a = ASSETS.find(x => x.symbol === symbol);
    if (!a) return [];
    const url = `${YAHOO_BASE}/v8/finance/chart/${encodeURIComponent(a.yahoo)}?interval=${interval}&range=${range}`;
    const res = await yahooFetch(url);
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
      const r = await fetch(s.url, { cache: "no-store" });
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
