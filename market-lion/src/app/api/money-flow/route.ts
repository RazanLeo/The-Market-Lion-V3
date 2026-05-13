import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/lib/feeds/rss";
import { classify } from "@/lib/feeds/aiAnalysis";

export const revalidate = 60;

// Known institution → category mapping
const INSTITUTION_KEYWORDS: { name: string; category: string; asset: string }[] = [
  { name: "BlackRock",      category: "Asset Manager",        asset: "XAU/USD" },
  { name: "Goldman Sachs",  category: "Investment Bank",      asset: "XAU/USD" },
  { name: "JPMorgan",       category: "Investment Bank",      asset: "EUR/USD" },
  { name: "Federal Reserve",category: "Central Bank",         asset: "USD" },
  { name: "ECB",            category: "Central Bank",         asset: "EUR/USD" },
  { name: "Saudi PIF",      category: "Sovereign Wealth Fund",asset: "XAU/USD" },
  { name: "Berkshire",      category: "Hedge Fund",           asset: "XAU/USD" },
  { name: "Citadel",        category: "HFT / Hedge Fund",     asset: "EUR/USD" },
  { name: "Bridgewater",    category: "Macro Fund",           asset: "XAU/USD" },
  { name: "Vanguard",       category: "Asset Manager",        asset: "XAU/USD" },
  { name: "OPEC",           category: "Commodity Org",        asset: "XTI/USD" },
  { name: "EIA",            category: "Energy Agency",        asset: "XTI/USD" },
  { name: "WGC",            category: "Gold Council",         asset: "XAU/USD" },
  { name: "CFTC",           category: "Regulator",            asset: "USD" },
];

function extractFlows(headlines: { source: string; title: string; pubDate: number }[]) {
  const flows: {
    time: number; institution: string; category: string;
    type: "BUY" | "SELL" | "NEUTRAL"; amount: string; asset: string; headline: string;
  }[] = [];

  for (const h of headlines) {
    const polarity = classify(h.title);
    const titleLower = h.title.toLowerCase();

    for (const inst of INSTITUTION_KEYWORDS) {
      if (titleLower.includes(inst.name.toLowerCase())) {
        flows.push({
          time:        h.pubDate,
          institution: inst.name,
          category:    inst.category,
          type:        polarity === 1 ? "BUY" : polarity === -1 ? "SELL" : "NEUTRAL",
          amount:      "—",
          asset:       inst.asset,
          headline:    h.title,
        });
        break;
      }
    }
  }
  return flows;
}

export async function GET(req: NextRequest) {
  const asset = req.nextUrl.searchParams.get("asset") ?? "";
  const headlines = await fetchAllNews().catch(() => []);
  let flows = extractFlows(headlines);
  if (asset) {
    flows = flows.filter(f => f.asset === asset || f.asset === "USD");
  }
  return NextResponse.json({ flows: flows.slice(0, 20), ts: Date.now() });
}
