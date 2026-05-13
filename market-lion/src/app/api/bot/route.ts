import { NextRequest, NextResponse } from "next/server";
import { BOT_ENTRY } from "@/data/weights";
import { effectiveRR } from "@/lib/tradePlan";
import { fetchEconomicCalendar } from "@/lib/feeds/calendar";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { confluence, levels, lots, asset, mode } = body || {};

  // 1) Confluence gate
  if (!confluence?.shouldBotEnter || lots <= 0 ||
      Math.abs(confluence?.daily ?? 0) < BOT_ENTRY.MIN_CONFLUENCE) {
    return NextResponse.json({ ok: true, allow: false, reason: "BELOW_CONFLUENCE", ts: Date.now() });
  }

  // 2) R:R floor — require ≥ 1:3 on TP4
  if (levels && effectiveRR(levels) < BOT_ENTRY.MIN_RR) {
    return NextResponse.json({ ok: true, allow: false, reason: "RR_BELOW_3", ts: Date.now() });
  }

  // 3) ±30-minute news blackout around HIGH/VERY_HIGH-impact events for this asset
  try {
    const calendar = await fetchEconomicCalendar();
    const now = Date.now();
    const blockMs = BOT_ENTRY.NEWS_BLOCK_MIN * 60_000;
    const assetParts = (asset ?? "").split("/").map((x: string) => x.toUpperCase());

    const inNewsWindow = calendar.some((e: any) => {
      if (e.importance !== "HIGH" && e.importance !== "VERY_HIGH") return false;
      const eventTs = new Date(e.timeUtc || e.time || 0).getTime();
      if (!eventTs || Math.abs(eventTs - now) > blockMs) return false;
      // Block if event affects any currency leg of the asset, or USD (universal)
      const evCurrencies: string[] = (e.assets ?? (e.currency ? [e.currency] : [])).map((x: string) => x.toUpperCase());
      if (evCurrencies.length === 0) return true; // unknown → safer to block
      return evCurrencies.some((c: string) => assetParts.includes(c) || c === "USD");
    });

    if (inNewsWindow) {
      return NextResponse.json({ ok: true, allow: false, reason: "NEWS_BLACKOUT", ts: Date.now() });
    }
  } catch {
    // calendar fetch failed — fail-open (don't block on network error)
  }

  return NextResponse.json({ ok: true, allow: true, asset, mode, lots, levels, ts: Date.now() });
}
