import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: true, app: "the-market-lion", v: "3.0.0", ts: Date.now() });
}
