import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Subscriptions — Admin", robots: { index: false, follow: false } };

const SUBS = [
  { id: "S-001", user: "Razan Tawfiq",  plan: "OWNER",       amount: 0,    status: "ACTIVE",    starts: "2026-01-01", ends: "Lifetime",  method: "—" },
  { id: "S-002", user: "Trader-218",  plan: "INDIVIDUAL",  amount: 2000, status: "ACTIVE",    starts: "2026-04-12", ends: "2026-05-12", method: "MADA" },
  { id: "S-003", user: "Trader-091",  plan: "INDIVIDUAL",  amount: 2000, status: "ACTIVE",    starts: "2026-04-15", ends: "2026-05-15", method: "Visa" },
  { id: "S-004", user: "Trader-302",  plan: "INSTITUTION", amount: 6000, status: "ACTIVE",    starts: "2026-04-01", ends: "2026-05-01", method: "PayPal" },
  { id: "S-005", user: "Trader-741",  plan: "INDIVIDUAL",  amount: 2000, status: "PAUSED",    starts: "2026-03-30", ends: "2026-04-30", method: "MADA" },
  { id: "S-006", user: "Trader-118",  plan: "INDIVIDUAL",  amount: 2000, status: "CANCELLED", starts: "2026-03-28", ends: "2026-04-28", method: "Mastercard" },
  { id: "S-007", user: "Trader-007",  plan: "INSTITUTION", amount: 6000, status: "ACTIVE",    starts: "2026-04-08", ends: "2026-05-08", method: "PayPal" },
];

export default function AdminSubs() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <Link href="/admin" className="text-gold-400 text-sm inline-flex items-center gap-1 mb-4"><ChevronLeft size={14}/> Admin Home</Link>
        <h1 className="font-display text-3xl gold-text mb-4">Subscriptions</h1>
        <div className="gold-card p-4 overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr><th>#</th><th>User</th><th>Plan</th><th>Amount</th><th>Status</th><th>Starts</th><th>Ends</th><th>Method</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {SUBS.map(s => (
                <tr key={s.id}>
                  <td className="font-mono text-xs">{s.id}</td>
                  <td className="font-semibold">{s.user}</td>
                  <td>{s.plan}</td>
                  <td className="text-gold-400">{s.amount.toLocaleString()} ﷼</td>
                  <td>
                    <span className={`chip ${s.status === "ACTIVE" ? "chip-buy" : s.status === "PAUSED" ? "chip-neutral" : "chip-sell"}`}>{s.status}</span>
                  </td>
                  <td className="text-zinc-400">{s.starts}</td>
                  <td className="text-zinc-400">{s.ends}</td>
                  <td>{s.method}</td>
                  <td className="space-x-1 space-x-reverse">
                    {s.status === "ACTIVE" && <button className="btn-ghost text-xs">Cancel</button>}
                    {s.status === "PAUSED" && <button className="btn-gold text-xs">Activate</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
