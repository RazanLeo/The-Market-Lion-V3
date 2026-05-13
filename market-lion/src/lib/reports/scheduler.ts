/**
 * Report scheduler — run as a standalone Node process on the droplet:
 *   npx ts-node -r tsconfig-paths/register src/lib/reports/scheduler.ts
 * Or compiled: node dist/scheduler.js
 *
 * Cron schedule (UTC):
 *   Daily   — every day at 23:55
 *   Weekly  — every Friday at 23:55
 *   Monthly — last day of month at 23:55
 */
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { generatePDF, type TradeRow } from "./pdfGenerator";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";

const prisma = new PrismaClient();
const OUT_DIR = process.env.REPORTS_DIR || "/var/data/reports";

async function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true });
}

async function buildReport(kind: "DAILY" | "WEEKLY" | "MONTHLY", periodStart: Date, periodEnd: Date) {
  const users = await prisma.user.findMany({
    where: { subscription: { status: "ACTIVE" } },
    include: { subscription: true, tradingAccount: true },
  });

  for (const user of users) {
    const trades = await prisma.trade.findMany({
      where: {
        userId: user.id,
        openedAt: { gte: periodStart, lte: periodEnd },
      },
      orderBy: { openedAt: "asc" },
    });

    const tradeRows: TradeRow[] = trades.map(t => ({
      openedAt:   t.openedAt,
      asset:      t.asset,
      side:       t.side,
      lots:       Number(t.lots),
      entryPrice: Number(t.entryPrice),
      pnl:        Number(t.pnl),
      status:     t.status,
    }));

    const totalPnl = tradeRows.reduce((s, t) => s + t.pnl, 0);
    const capitalStart = Number(user.tradingAccount?.capital ?? 10000);
    const capitalEnd   = capitalStart + totalPnl;

    const pdfBytes = await generatePDF({
      kind, periodStart, periodEnd,
      userName:     user.name || user.email,
      trades:       tradeRows,
      capitalStart,
      capitalEnd,
    });

    const userDir = join(OUT_DIR, user.id);
    await ensureDir(userDir);
    const filename = `${kind.toLowerCase()}_${periodStart.toISOString().slice(0, 10)}.pdf`;
    const pdfPath  = join(userDir, filename);
    writeFileSync(pdfPath, pdfBytes);

    const pdfUrl = `/reports/${user.id}/${filename}`;

    await prisma.report.create({
      data: {
        userId:      user.id,
        kind,
        periodStart,
        periodEnd,
        pdfUrl,
        summary: {
          trades:    tradeRows.length,
          totalPnl,
          capitalStart,
          capitalEnd,
        },
      },
    });

    console.log(`[Reports] ${kind} generated for ${user.email}: ${pdfUrl}`);
  }
}

// Daily at 23:55 UTC
cron.schedule("55 23 * * *", async () => {
  const now   = new Date();
  const start = startOfDay(subDays(now, 1));
  const end   = endOfDay(subDays(now, 1));
  await buildReport("DAILY", start, end).catch(console.error);
});

// Weekly on Friday at 23:55 UTC
cron.schedule("55 23 * * 5", async () => {
  const now   = new Date();
  const start = startOfWeek(subDays(now, 1), { weekStartsOn: 6 }); // Saturday
  const end   = endOfWeek(subDays(now, 1),   { weekStartsOn: 6 }); // Friday
  await buildReport("WEEKLY", start, end).catch(console.error);
});

// Monthly on last day of month at 23:55 UTC
cron.schedule("55 23 28-31 * *", async () => {
  const now  = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  // Only run on actual last day
  if (tomorrow.getMonth() === now.getMonth()) return;
  const start = startOfMonth(now);
  const end   = endOfMonth(now);
  await buildReport("MONTHLY", start, end).catch(console.error);
});

console.log("[Reports] Scheduler started — daily 23:55, weekly Fri 23:55, monthly last-day 23:55 (UTC)");
