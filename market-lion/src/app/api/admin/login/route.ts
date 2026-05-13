import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const OWNER_EMAIL = (process.env.OWNER_EMAIL || "razan.tawfiq@gmail.com").toLowerCase();
const OWNER_PW    =  process.env.OWNER_PW    || "RazanLeo@1Roza";

function safeEq(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a.padEnd(64, "\0"));
    const bb = Buffer.from(b.padEnd(64, "\0"));
    return crypto.timingSafeEqual(ba.slice(0,64), bb.slice(0,64)) && a.length === b.length;
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const email    = String(fd.get("email")    || "").toLowerCase().trim();
  const password = String(fd.get("password") || "");

  if (!safeEq(email, OWNER_EMAIL) || !safeEq(password, OWNER_PW)) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", req.url));
  }
  const token = crypto.randomBytes(32).toString("hex");
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set("ml_admin_session", token, {
    httpOnly: true, sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin", maxAge: 60 * 60 * 8,
  });
  return res;
}
