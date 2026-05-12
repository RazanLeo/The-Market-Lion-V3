import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "إدارة المستخدمين — Admin", robots: { index: false, follow: false } };

const USERS = [
  { id: 1, name: "رزان توفيق",  email: "razan.tawfiq@gmail.com", plan: "OWNER",       status: "ACTIVE", broker: "Exness",      mt5: "260842468", capital: 10000, country: "SA" },
  { id: 2, name: "Trader-218",  email: "trader218@gmail.com",    plan: "INDIVIDUAL",  status: "ACTIVE", broker: "Exness",      mt5: "12345678",  capital: 5000,  country: "AE" },
  { id: 3, name: "Trader-091",  email: "user091@gmail.com",      plan: "INDIVIDUAL",  status: "ACTIVE", broker: "Capital.com", mt5: "55512345",  capital: 8500,  country: "EG" },
  { id: 4, name: "Trader-302",  email: "ahmad302@hotmail.com",   plan: "INSTITUTION", status: "ACTIVE", broker: "IC Markets",  mt5: "98765432",  capital: 250000, country: "KW" },
  { id: 5, name: "Trader-741",  email: "fatima741@yahoo.com",    plan: "INDIVIDUAL",  status: "PAUSED", broker: "Exness",      mt5: "21458790",  capital: 3000,  country: "JO" },
  { id: 6, name: "Trader-118",  email: "user118@outlook.com",    plan: "INDIVIDUAL",  status: "CANCELLED", broker: "FBS",      mt5: "32109876",  capital: 0,     country: "MA" },
  { id: 7, name: "Trader-007",  email: "trader007@gmail.com",    plan: "INSTITUTION", status: "ACTIVE", broker: "Pepperstone", mt5: "77788899",  capital: 500000, country: "QA" },
];

const statusColor: any = { ACTIVE: "chip-buy", PAUSED: "chip-neutral", CANCELLED: "chip-sell", OWNER: "chip-tier-S" };

export default function AdminUsers() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <Link href="/admin" className="text-gold-400 text-sm inline-flex items-center gap-1 mb-4"><ChevronLeft size={14}/> Admin Home</Link>
        <h1 className="font-display text-3xl gold-text mb-4">إدارة المستخدمين</h1>
        <div className="gold-card p-4 overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>#</th><th>الاسم</th><th>البريد</th><th>الباقة</th><th>الحالة</th>
                <th>الوسيط</th><th>رقم الحساب</th><th>رأس المال</th><th>الدولة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td className="font-semibold">{u.name}</td>
                  <td className="text-zinc-400 text-xs">{u.email}</td>
                  <td><span className={`chip ${u.plan === "OWNER" ? "chip-tier-S" : u.plan === "INSTITUTION" ? "chip-tier-A" : "chip-tier-B"}`}>{u.plan}</span></td>
                  <td><span className={`chip ${statusColor[u.status] || "chip-neutral"}`}>{u.status}</span></td>
                  <td className="text-zinc-300">{u.broker}</td>
                  <td className="text-zinc-400 font-mono text-xs">{u.mt5}</td>
                  <td className="text-gold-400 font-mono">${u.capital.toLocaleString()}</td>
                  <td className="text-zinc-400">{u.country}</td>
                  <td className="space-x-1 space-x-reverse whitespace-nowrap">
                    {u.status === "ACTIVE" ? <button className="btn-ghost text-xs">إيقاف</button> : <button className="btn-gold text-xs">تفعيل</button>}
                    <button className="btn-ghost text-xs">ربط MT5</button>
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
