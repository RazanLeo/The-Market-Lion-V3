import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Trades — Admin", robots: { index: false, follow: false } };

const TRADES = [
  { id: "T-12540", user: "Trader-218", asset: "XAU/USD", side: "BUY",  lots: 0.05, entry: 2050.50, sl: 2045.50, tp: 2065.50, pnl: 120.40, status: "CLOSED", time: "2026-05-12 06:30" },
  { id: "T-12539", user: "Trader-091", asset: "EUR/USD", side: "SELL", lots: 0.20, entry: 1.0820,  sl: 1.0855,  tp: 1.0765,  pnl: -45.10, status: "CLOSED", time: "2026-05-12 06:15" },
  { id: "T-12538", user: "Trader-302", asset: "XTI/USD", side: "BUY",  lots: 0.10, entry: 78.40,   sl: 77.20,   tp: 82.00,   pnl: 78.65,  status: "CLOSED", time: "2026-05-12 05:50" },
  { id: "T-12537", user: "Trader-007", asset: "GBP/USD", side: "BUY",  lots: 0.15, entry: 1.2510,  sl: 1.2485,  tp: 1.2585,  pnl: 210.00, status: "CLOSED", time: "2026-05-12 04:20" },
  { id: "T-12536", user: "Trader-444", asset: "USD/JPY", side: "SELL", lots: 0.30, entry: 152.80,  sl: 153.40,  tp: 151.60,  pnl: -92.00, status: "CLOSED", time: "2026-05-12 03:55" },
  { id: "T-12535", user: "Trader-218", asset: "XAU/USD", side: "BUY",  lots: 0.05, entry: 2048.20, sl: 2043.20, tp: 2063.20, pnl: 0,      status: "OPEN",   time: "2026-05-12 07:00" },
];

export default function AdminTrades() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <Link href="/admin" className="text-gold-400 text-sm inline-flex items-center gap-1 mb-4"><ChevronLeft size={14}/> Admin Home</Link>
        <h1 className="font-display text-3xl gold-text mb-4">Trades (History + Live)</h1>
        <div className="gold-card p-4 overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr><th>#</th><th>User</th><th>Asset</th><th>Side</th><th>Lot</th><th>Entry</th><th>SL</th><th>TP</th><th>PnL</th><th>Status</th><th>Time</th></tr>
            </thead>
            <tbody>
              {TRADES.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs">{t.id}</td>
                  <td>{t.user}</td>
                  <td className="font-semibold">{t.asset}</td>
                  <td>{t.side === "BUY" ? <span className="chip-buy">BUY</span> : <span className="chip-sell">SELL</span>}</td>
                  <td>{t.lots.toFixed(2)}</td>
                  <td className="font-mono">{t.entry}</td>
                  <td className="font-mono text-red-400">{t.sl}</td>
                  <td className="font-mono text-green-400">{t.tp}</td>
                  <td className={t.pnl > 0 ? "text-green-400 font-mono" : t.pnl < 0 ? "text-red-400 font-mono" : "text-zinc-400 font-mono"}>
                    {t.pnl > 0 ? "+" : ""}{t.pnl.toFixed(2)}
                  </td>
                  <td><span className={`chip ${t.status === "OPEN" ? "chip-tier-A" : "chip-neutral"}`}>{t.status}</span></td>
                  <td className="text-zinc-400 text-xs whitespace-nowrap">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
