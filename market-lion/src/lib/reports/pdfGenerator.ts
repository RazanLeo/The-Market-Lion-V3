import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import { format } from "date-fns";

export type TradeRow = {
  openedAt: Date;
  asset: string;
  side: string;
  lots: number;
  entryPrice: number;
  pnl: number;
  status: string;
};

export type ReportData = {
  kind: "DAILY" | "WEEKLY" | "MONTHLY";
  periodStart: Date;
  periodEnd: Date;
  userName: string;
  trades: TradeRow[];
  capitalStart: number;
  capitalEnd: number;
};

// Gold color
const GOLD  = rgb(0.68, 0.57, 0.32);
const WHITE = rgb(1, 1, 1);
const GRAY  = rgb(0.6, 0.6, 0.6);
const GREEN = rgb(0.13, 0.77, 0.37);
const RED   = rgb(0.93, 0.26, 0.26);
const DARK  = rgb(0.04, 0.04, 0.04);

const MARGIN = 50;
const PAGE_W = 595;
const PAGE_H = 842;

function drawText(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size: number, color = WHITE) {
  page.drawText(text, { x, y, font, size, color });
}

function drawHR(page: PDFPage, y: number, color = GOLD) {
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color });
}

export async function generatePDF(data: ReportData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const helveticaBold   = await doc.embedFont(StandardFonts.HelveticaBold);
  const helvetica       = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const kindLabel: Record<string, string> = {
    DAILY: "Daily Report", WEEKLY: "Weekly Report", MONTHLY: "Monthly Report",
  };

  // ── Page 1: Header + Summary ──
  const page1 = doc.addPage([PAGE_W, PAGE_H]);
  page1.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 90, color: DARK });

  // Logo text
  drawText(page1, "The Market Lion", MARGIN, PAGE_H - 55, helveticaBold, 22, GOLD);
  drawText(page1, "أسد السوق — AI Trading Platform", MARGIN, PAGE_H - 75, helvetica, 10, GRAY);

  const periodStr = `${format(data.periodStart, "yyyy-MM-dd")} → ${format(data.periodEnd, "yyyy-MM-dd")}`;
  drawText(page1, kindLabel[data.kind] ?? data.kind, PAGE_W - MARGIN - 120, PAGE_H - 50, helveticaBold, 14, GOLD);
  drawText(page1, periodStr, PAGE_W - MARGIN - 120, PAGE_H - 68, helvetica, 9, GRAY);

  // Client info
  let y = PAGE_H - 110;
  drawText(page1, `Client: ${data.userName}`, MARGIN, y, helveticaBold, 11, WHITE);
  y -= 16;
  drawText(page1, `Generated: ${format(new Date(), "yyyy-MM-dd HH:mm")} UTC`, MARGIN, y, helvetica, 9, GRAY);

  // Summary box
  y -= 30;
  drawHR(page1, y + 15);
  drawText(page1, "Performance Summary", MARGIN, y, helveticaBold, 13, GOLD);
  y -= 20;

  const totalPnl = data.trades.reduce((s, t) => s + t.pnl, 0);
  const wins = data.trades.filter(t => t.pnl > 0).length;
  const losses = data.trades.filter(t => t.pnl < 0).length;
  const winRate = data.trades.length ? ((wins / data.trades.length) * 100).toFixed(1) : "0.0";
  const pnlPct = data.capitalStart > 0 ? ((totalPnl / data.capitalStart) * 100).toFixed(2) : "0.00";

  const summaryItems = [
    ["Total Trades",   String(data.trades.length)],
    ["Wins / Losses",  `${wins} / ${losses}`],
    ["Win Rate",       `${winRate}%`],
    ["Total P&L",      `${totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)} $`],
    ["Return %",       `${pnlPct}%`],
    ["Capital (start)", `${data.capitalStart.toFixed(2)} $`],
    ["Capital (end)",   `${data.capitalEnd.toFixed(2)} $`],
  ];

  for (const [label, val] of summaryItems) {
    const isProfit = val.startsWith("+") || (label === "Return %" && !val.startsWith("-"));
    const isLoss   = val.startsWith("-");
    const valColor = isProfit ? GREEN : isLoss ? RED : WHITE;
    drawText(page1, label, MARGIN, y, helvetica, 10, GRAY);
    drawText(page1, val, 250, y, helveticaBold, 10, valColor);
    y -= 18;
  }

  drawHR(page1, y);
  y -= 25;

  // ── Trade table ──
  drawText(page1, "Trade Log", MARGIN, y, helveticaBold, 13, GOLD);
  y -= 18;

  const cols = [
    { label: "Date",   x: MARGIN,       w: 80 },
    { label: "Asset",  x: MARGIN + 80,  w: 55 },
    { label: "Side",   x: MARGIN + 135, w: 40 },
    { label: "Lots",   x: MARGIN + 175, w: 45 },
    { label: "Entry",  x: MARGIN + 220, w: 65 },
    { label: "P&L $",  x: MARGIN + 285, w: 65 },
    { label: "Status", x: MARGIN + 350, w: 60 },
  ];

  // Table header
  page1.drawRectangle({ x: MARGIN - 4, y: y - 4, width: PAGE_W - 2 * MARGIN + 8, height: 16, color: rgb(0.12, 0.10, 0.04) });
  for (const c of cols) drawText(page1, c.label, c.x, y, helveticaBold, 8, GOLD);
  y -= 18;

  let currentPage = page1;
  for (const tr of data.trades) {
    if (y < 60) {
      currentPage = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
    const pnlColor = tr.pnl > 0 ? GREEN : tr.pnl < 0 ? RED : GRAY;
    const dateStr = format(tr.openedAt, "MM-dd HH:mm");
    const vals = [
      dateStr,
      tr.asset.replace("/USD", ""),
      tr.side,
      tr.lots.toFixed(2),
      tr.entryPrice.toFixed(tr.asset === "USD/JPY" ? 2 : 4),
      `${tr.pnl >= 0 ? "+" : ""}${tr.pnl.toFixed(2)}`,
      tr.status,
    ];
    for (let i = 0; i < cols.length; i++) {
      const color = i === 5 ? pnlColor : i === 2 ? (tr.side === "BUY" ? GREEN : RED) : WHITE;
      drawText(currentPage, vals[i], cols[i].x, y, i === 0 ? helveticaOblique : helvetica, 8, color);
    }
    y -= 14;
    if (y % (14 * 3) < 14) {
      currentPage.drawLine({
        start: { x: MARGIN, y: y + 1 }, end: { x: PAGE_W - MARGIN, y: y + 1 },
        thickness: 0.2, color: rgb(0.2, 0.2, 0.2),
      });
    }
  }

  // Footer on last page
  if (y > 40) {
    drawHR(currentPage, 40);
    drawText(currentPage, "The Market Lion — Confidential. For authorized client use only.", MARGIN, 28, helvetica, 8, GRAY);
    drawText(currentPage, `Generated ${format(new Date(), "yyyy-MM-dd")}`, PAGE_W - 160, 28, helvetica, 8, GRAY);
  }

  return doc.save();
}
