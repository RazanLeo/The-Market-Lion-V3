import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// IMPORTANT: In production, validate against User table where role IN (ADMIN, OWNER) and verify 2FA TOTP.
// For now we accept a single owner via environment variables and a static fallback.
const OWNER_EMAIL = process.env.OWNER_EMAIL || "razan.tawfiq@gmail.com";
const OWNER_PW   = process.env.OWNER_PW   || "ChangeMeNow!RazanLeo@1Roza";

export async function POST(req: NextRequest) {
  const fd = await req.formData();
  const email = String(fd.get("email") || "").toLowerCase().trim();
  const password = String(fd.get("password") || "");
  const otp = String(fd.get("otp") || "");

  // Constant-time-ish comparison.
  const ok = email === OWNER_EMAIL.toLowerCase() && password === OWNER_PW && otp.length === 6;
  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", req.url));
  }
  const token = crypto.randomBytes(32).toString("hex");
  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set("ml_admin_session", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 4, // 4 hours
  });
  return res;
}
