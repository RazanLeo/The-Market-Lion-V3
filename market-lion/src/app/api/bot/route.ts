import { NextRequest, NextResponse } from "next/server";
import { BOT_ENTRY } from "@/data/weights";
import { effectiveRR } from "@/lib/tradePlan";
import { fetchEconomicCalendar } from "@/lib/feeds/calendar";
import { brokerPlaceOrder, type BrokerType } from "@/lib/brokers";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { confluence, levels, lots, asset, mode, broker, brokerCreds } = body || {};

  // 1) Confluence gate
  if (!confluence?.shouldBotEnter || lots <= 0 ||
      Math.abs(confluence?.daily ?? 0) < BOT_ENTRY.MIN_CONFLUENCE) {
    return NextResponse.json({ ok: true, allow: false, reason: "BELOW_CONFLUENCE", ts: Date.now() });
  }

  // 2) R:R floor — require ≥ 1:3 on TP4
  if (levels && effectiveRR(levels) < BOT_ENTRY.MIN_RR) {
    return NextResponse.json({ ok: true, allow: false, reason: "RR_BELOW_3", ts: Date.now() });
  }

  // 3) ±30-minute news blackout
  try {
    const calendar = await fetchEconomicCalendar();
    const now = Date.now();
    const blockMs = BOT_ENTRY.NEWS_BLOCK_MIN * 60_000;
    const assetParts = (asset ?? "").split("/").map((x: string) => x.toUpperCase());

    const inNewsWindow = calendar.some((e: any) => {
      if (e.importance !== "HIGH" && e.importance !== "VERY_HIGH") return false;
      const eventTs = new Date(e.timeUtc || e.time || 0).getTime();
      if (!eventTs || Math.abs(eventTs - now) > blockMs) return false;
      const evCurrencies: string[] = (e.assets ?? (e.currency ? [e.currency] : [])).map((x: string) => x.toUpperCase());
      if (evCurrencies.length === 0) return true;
      return evCurrencies.some((c: string) => assetParts.includes(c) || c === "USD");
    });

    if (inNewsWindow) {
      return NextResponse.json({ ok: true, allow: false, reason: "NEWS_BLACKOUT", ts: Date.now() });
    }
  } catch { /* fail-open */ }

  // 4) Execute via broker if credentials provided
  let executed = false;
  let brokerResult: any = null;

  if (broker && brokerCreds && mode !== "MANUAL") {
    try {
      brokerResult = await brokerPlaceOrder(
        broker as BrokerType,
        brokerCreds,
        {
          asset,
          direction: confluence.direction as "BUY" | "SELL",
          lots,
          sl:  levels.sl,
          tp:  levels.tp3,  // use TP3 as primary take-profit
        }
      );
      executed = true;
    } catch (err: any) {
      brokerResult = { error: err?.message ?? "Broker execution failed" };
    }
  }

  return NextResponse.json({
    ok:       true,
    allow:    true,
    executed,
    broker,
    asset,
    mode,
    lots,
    levels,
    brokerResult,
    ts: Date.now(),
  });
}
