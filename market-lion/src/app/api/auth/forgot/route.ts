import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  // Placeholder: in production, generate a JWT reset token + send email via SES/SMTP.
  return NextResponse.redirect(new URL("/login?reset=sent", req.url));
}
