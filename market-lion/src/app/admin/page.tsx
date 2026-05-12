import Link from "next/link";
import { Users, CreditCard, LineChart, Settings, ShieldCheck, Activity, AlertTriangle, FileText, DollarSign } from "lucide-react";
import { LionMark } from "@/components/LionMark";

export const metadata = {
  title: "لوحة الإدارة — The Market Lion Admin",
  robots: { index: false, follow: false },
};

const cards = [
  { icon: <Users size={22}/>,         title: "المستخدمون",     desc: "عرض، تفعيل، إيقاف، حذف، ربط حساب التداول", href: "/admin/users",          k: "1,284" },
  { icon: <CreditCard size={22}/>,    title: "الاشتراكات",     desc: "متابعة المدفوعات، التجديد، الإلغاء",      href: "/admin/subscriptions",  k: "871"   },
  { icon: <LineChart size={22}/>,     title: "الصفقات",        desc: "أرشيف الصفقات + الأداء + سجل المخاطر",    href: "/admin/trades",         k: "12,540" },
  { icon: <Activity size={22}/>,      title: "الأداء العام",   desc: "Win-rate / PnL / Drawdown / Sharpe",       href: "/admin",                k: "+18.4%" },
  { icon: <DollarSign size={22}/>,    title: "الإيرادات",     desc: "ريال سعودي / دولار / نمو شهري",            href: "/admin",                k: "—" },
  { icon: <AlertTriangle size={22}/>, title: "التنبيهات",     desc: "أحداث، أخطاء، حظر",                        href: "/admin",                k: "3"     },
  { icon: <FileText size={22}/>,      title: "السجل (Audit)", desc: "كل العمليات الإدارية مسجّلة",              href: "/admin",                k: "—" },
  { icon: <Settings size={22}/>,      title: "الإعدادات",     desc: "اللغات / الألوان / الأسعار / الأخبار",      href: "/admin/settings",       k: "—" },
];

export default function AdminHome() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-gold-500/30 bg-black/85 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center gap-3">
          <LionMark size={26}/>
          <div className="leading-tight">
            <div className="text-gold-400 font-bold">Admin Console — أسد السوق</div>
            <div className="text-[10px] text-zinc-400">Restricted • Owner & Admin team only</div>
          </div>
          <div className="ms-auto flex items-center gap-3 text-sm">
            <span className="text-zinc-400">razan.tawfiq@gmail.com</span>
            <form action="/api/admin/logout" method="post"><button className="btn-ghost text-xs">Sign out</button></form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-gold-400" />
          <h1 className="font-display text-2xl gold-text">لوحة الإدارة (Admin)</h1>
        </div>
        <p className="text-zinc-400 text-sm">تحكم كامل في المنصة. هذه اللوحة منفصلة تماماً عن المستخدم العادي ولا يراها.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <Link key={i} href={c.href} className="gold-card p-5 hover:shadow-gold transition">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-gold-500/15 text-gold-400 grid place-items-center">{c.icon}</div>
                <div className="font-display text-2xl text-gold-400">{c.k}</div>
              </div>
              <h3 className="font-bold text-zinc-100">{c.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{c.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mt-8">
          <div className="gold-card p-5">
            <h3 className="text-gold-400 font-bold mb-3">آخر الصفقات (5)</h3>
            <table className="tbl text-xs">
              <thead><tr><th>المستخدم</th><th>الأصل</th><th>الجانب</th><th>الحجم</th><th>PnL</th></tr></thead>
              <tbody>
                <tr><td>Trader-218</td><td>XAU/USD</td><td><span className="chip-buy">شراء</span></td><td>0.05</td><td className="text-green-400">+$120.40</td></tr>
                <tr><td>Trader-091</td><td>EUR/USD</td><td><span className="chip-sell">بيع</span></td><td>0.20</td><td className="text-red-400">-$45.10</td></tr>
                <tr><td>Trader-302</td><td>XTI/USD</td><td><span className="chip-buy">شراء</span></td><td>0.10</td><td className="text-green-400">+$78.65</td></tr>
                <tr><td>Trader-007</td><td>GBP/USD</td><td><span className="chip-buy">شراء</span></td><td>0.15</td><td className="text-green-400">+$210.00</td></tr>
                <tr><td>Trader-444</td><td>USD/JPY</td><td><span className="chip-sell">بيع</span></td><td>0.30</td><td className="text-red-400">-$92.00</td></tr>
              </tbody>
            </table>
          </div>
          <div className="gold-card p-5">
            <h3 className="text-gold-400 font-bold mb-3">آخر الاشتراكات</h3>
            <table className="tbl text-xs">
              <thead><tr><th>المستخدم</th><th>الباقة</th><th>المبلغ</th><th>الحالة</th><th>التاريخ</th></tr></thead>
              <tbody>
                <tr><td>Trader-512</td><td>أفراد</td><td>2,000 ﷼</td><td><span className="chip-buy">ACTIVE</span></td><td>اليوم</td></tr>
                <tr><td>Trader-309</td><td>مؤسسات</td><td>6,000 ﷼</td><td><span className="chip-buy">ACTIVE</span></td><td>أمس</td></tr>
                <tr><td>Trader-741</td><td>أفراد</td><td>2,000 ﷼</td><td><span className="chip-neutral">PAUSED</span></td><td>2026-04-30</td></tr>
                <tr><td>Trader-118</td><td>أفراد</td><td>2,000 ﷼</td><td><span className="chip-sell">CANCELLED</span></td><td>2026-04-28</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
