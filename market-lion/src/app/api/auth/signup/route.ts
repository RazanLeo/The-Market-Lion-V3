import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  // In production: validate, hash password, persist user + trading account, redirect to checkout.
  return NextResponse.redirect(new URL("/dashboard?welcome=1", req.url));
}
