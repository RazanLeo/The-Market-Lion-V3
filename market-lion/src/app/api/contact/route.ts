import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const name = fd.get("name"); const email = fd.get("email"); const subject = fd.get("subject"); const message = fd.get("message");
  // In production: forward to support inbox or persist to DB.
  return NextResponse.json({ ok: true, received: { name, email, subject, len: String(message||"").length } });
}
