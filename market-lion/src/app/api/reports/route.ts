import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generatePDF } from "@/lib/reports/pdfGenerator";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// GET /api/reports?kind=DAILY — generate and return a PDF report for the authenticated user
export async function GET(req: NextRequest) {
  const session = req.cookies.get("next-auth.session-token")?.value
    || req.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbSession = await prisma.session.findUnique({ where: { sessionToken: session } });
  if (!dbSession || dbSession.expires < new Date()) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where:   { id: dbSession.userId },
    include: { tradingAccount: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const kind = (req.nextUrl.searchParams.get("kind") || "DAILY").toUpperCase() as "DAILY" | "WEEKLY" | "MONTHLY";
  const now  = new Date();

  let periodStart: Date;
  let periodEnd:   Date;

  if (kind === "WEEKLY") {
    periodStart = startOfWeek(subDays(now, 1), { weekStartsOn: 6 });
    periodEnd   = endOfWeek(subDays(now, 1),   { weekStartsOn: 6 });
  } else if (kind === "MONTHLY") {
    periodStart = startOfMonth(now);
    periodEnd   = endOfMonth(now);
  } else {
    periodStart = startOfDay(subDays(now, 1));
    periodEnd   = endOfDay(subDays(now, 1));
  }

  const trades = await prisma.trade.findMany({
    where: { userId: user.id, openedAt: { gte: periodStart, lte: periodEnd } },
    orderBy: { openedAt: "asc" },
  });

  const tradeRows = trades.map(t => ({
    openedAt:   t.openedAt,
    asset:      t.asset,
    side:       t.side,
    lots:       Number(t.lots),
    entryPrice: Number(t.entryPrice),
    pnl:        Number(t.pnl),
    status:     t.status,
  }));

  const capitalStart = Number(user.tradingAccount?.capital ?? 10000);
  const totalPnl     = tradeRows.reduce((s, t) => s + t.pnl, 0);

  const pdfBytes = await generatePDF({
    kind,
    periodStart,
    periodEnd,
    userName:     user.name || user.email,
    trades:       tradeRows,
    capitalStart,
    capitalEnd:   capitalStart + totalPnl,
  });

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="market-lion-${kind.toLowerCase()}-${now.toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
