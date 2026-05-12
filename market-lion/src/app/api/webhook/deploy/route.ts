import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const HOOK_SECRET = process.env.DEPLOY_HOOK_SECRET ?? "ml-deploy-2026-lion";

export async function GET() {
  return NextResponse.json({ ok: true, ready: true });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    if (!body.secret || body.secret !== HOOK_SECRET) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const { stdout, stderr } = await execAsync(
      "cd /var/www/market-lion && git fetch origin main && git reset --hard origin/main",
      { timeout: 60000 }
    );

    return NextResponse.json({ ok: true, stdout, stderr, ts: Date.now() });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "unknown" }, { status: 500 });
  }
}
