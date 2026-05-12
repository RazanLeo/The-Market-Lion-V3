// Real-time RSS readers — no paid APIs, all free public RSS endpoints.
// Sources from the master prompt: Reuters, Bloomberg, CNBC, OPEC, IEA, EIA, WGC, IMF, CFTC.

export type NewsItem = {
  id: string;
  source: string;
  title: string;
  link: string;
  pubDate: number;          // unix ms
  asset?: string;           // mapped asset (XAU/USD, USD, etc.)
  importance?: "HIGH"|"MEDIUM"|"LOW"|"VERY_HIGH";
  category: "NEWS"|"INDICATOR"|"STATEMENT";
};

const FEEDS = [
  // Macro & general financial
  { source: "Reuters Business",   url: "https://feeds.reuters.com/reuters/businessNews",      cat: "NEWS" as const },
  { source: "CNBC Markets",       url: "https://www.cnbc.com/id/100003114/device/rss/rss.html", cat: "NEWS" as const },
  // Government & central banks
  { source: "Federal Reserve",    url: "https://www.federalreserve.gov/feeds/press_all.xml",  cat: "STATEMENT" as const },
  { source: "ECB",                url: "https://www.ecb.europa.eu/rss/press.html",            cat: "STATEMENT" as const },
  { source: "Bank of England",    url: "https://www.bankofengland.co.uk/rss/news",            cat: "STATEMENT" as const },
  { source: "US Treasury",        url: "https://home.treasury.gov/news/press-releases/feed",  cat: "STATEMENT" as const },
  // Energy / Oil
  { source: "OPEC",               url: "https://www.opec.org/opec_web/en/_xmlrss/index/13.xml", cat: "NEWS" as const },
  { source: "EIA",                url: "https://www.eia.gov/rss/todayinenergy.xml",          cat: "NEWS" as const },
  { source: "IEA",                url: "https://www.iea.org/news.xml",                       cat: "NEWS" as const },
  // Gold
  { source: "WGC",                url: "https://www.gold.org/feed/all-rss.xml",              cat: "NEWS" as const },
  // CFTC (COT reports)
  { source: "CFTC",               url: "https://www.cftc.gov/rss/release/0/RSS",             cat: "INDICATOR" as const },
];

function detectAsset(title: string): string | undefined {
  const t = title.toLowerCase();
  if (/(gold|xau|bullion|precious metal)/i.test(t)) return "XAU/USD";
  if (/(oil|crude|brent|wti|opec|petroleum|gasoline)/i.test(t)) return "XTI/USD";
  if (/(\beur\b|euro|ecb|lagarde|eurozone)/i.test(t)) return "EUR/USD";
  if (/(\bgbp\b|pound|sterling|boe|bailey)/i.test(t)) return "GBP/USD";
  if (/(yen|\bjpy\b|boj|ueda)/i.test(t)) return "USD/JPY";
  if (/(franc|chf|snb)/i.test(t)) return "USD/CHF";
  if (/(loonie|cad|boc|canadian dollar)/i.test(t)) return "USD/CAD";
  if (/(aussie|aud|rba)/i.test(t)) return "AUD/USD";
  if (/(kiwi|nzd|rbnz)/i.test(t)) return "NZD/USD";
  return "USD";
}

function detectImportance(title: string, source: string): NewsItem["importance"] {
  const t = title.toLowerCase();
  if (/(rate decision|fomc|interest rate|cpi|inflation|nfp|non-farm|payrolls|gdp)/i.test(t)) return "VERY_HIGH";
  if (/(powell|lagarde|trump|bin salman|opec|treasury|fed minutes)/i.test(t)) return "HIGH";
  if (source === "Reuters Business" || source === "CNBC Markets") return "MEDIUM";
  return "LOW";
}

function hash(s: string): string {
  let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return String(h).replace("-", "n");
}

async function fetchOne(feed: typeof FEEDS[number]): Promise<NewsItem[]> {
  try {
    const r = await fetch(feed.url, {
      next: { revalidate: 30 },
      headers: { "user-agent": "MarketLion/3.0 (+https://themarketlion.com)" },
    });
    if (!r.ok) return [];
    const xml = await r.text();
    // Lightweight XML parsing — works for typical RSS 2.0 / Atom feeds.
    const items = xml.split(/<item[^>]*>|<entry[^>]*>/i).slice(1, 21);
    const out: NewsItem[] = [];
    for (const it of items) {
      const title = (it.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "")
        .replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim();
      const link  = (it.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ||
                     it.match(/<link[^>]+href="([^"]+)"/i)?.[1] || "").trim();
      const date  = (it.match(/<(pubDate|updated|published)>([\s\S]*?)<\/\1>/i)?.[2] || "").trim();
      if (!title) continue;
      out.push({
        id: hash(feed.source + "|" + title + "|" + date),
        source: feed.source,
        title,
        link,
        pubDate: date ? new Date(date).getTime() : Date.now(),
        asset: detectAsset(title),
        importance: detectImportance(title, feed.source),
        category: feed.cat,
      });
    }
    return out;
  } catch { return []; }
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const lists = await Promise.all(FEEDS.map(fetchOne));
  const all = lists.flat();
  // de-dup by title
  const seen = new Set<string>();
  const dedup: NewsItem[] = [];
  for (const n of all.sort((a, b) => b.pubDate - a.pubDate)) {
    const k = n.title.toLowerCase().slice(0, 80);
    if (seen.has(k)) continue;
    seen.add(k); dedup.push(n);
  }
  return dedup;
}
