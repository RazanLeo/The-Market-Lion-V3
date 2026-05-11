import { NextRequest, NextResponse } from "next/server";
import { BOT_ENTRY } from "@/data/weights";

// Placeholder bot orchestration. Real MT5 execution requires running a Python
// connector (see /scripts/mt5_bridge.py) on the server with MetaTrader5 module.
// For safety, this endpoint never auto-executes trades. It returns the would-be
// trade plan that the user can confirm.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { confluence, levels, lots, asset, mode } = body || {};
  const allow = confluence?.shouldBotEnter && lots > 0 && Math.abs(confluence?.daily ?? 0) >= BOT_ENTRY.MIN_CONFLUENCE;
  return NextResponse.json({ ok: true, allow, asset, mode, lots, levels, ts: Date.now() });
}
