import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Users, CreditCard, LineChart, Settings, ShieldCheck, Activity, AlertTriangle } from "lucide-react";

export const metadata = { title: "لوحة الإدارة — The Market Lion" };

const cards = [
  { icon: <Users/>,       title: "المستخدمون",     desc: "عرض، تفعيل، إيقاف، حذف", href: "/admin/users", k: "1,284" },
  { icon: <CreditCard/>,  title: "الاشتراكات",     desc: "متابعة المدفوعات والتجديد", href: "/admin/subscriptions", k: "871" },
  { icon: <LineChart/>,   title: "الصفقات",        desc: "أرشيف الصفقات والأداء",       href: "/admin/trades", k: "12,540" },
  { icon: <Activity/>,    title: "الأداء العام",   desc: "Win-rate / PnL / Drawdown",   href: "/admin", k: "+18.4%" },
  { icon: <AlertTriangle/>, title: "التنبيهات",   desc: "أحداث، أخطاء، حظر",            href: "/admin", k: "3" },
  { icon: <Settings/>,    title: "الإعدادات",      desc: "اللغات / الألوان / الأسعار",   href: "/admin/settings", k: "—" },
];

export default function AdminHome() {
  return (
    <>
      <Header variant="app"/>
      <main className="max-w-7xl mx-auto px-5 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-gold-400" />
          <h1 className="font-display text-2xl gold-text">لوحة الإدارة (Admin)</h1>
        </div>
        <p className="text-zinc-400 text-sm">تحكم كامل في المنصة. هذه اللوحة منفصلة عن دخول المستخدمين.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <Link key={i} href={c.href} className="gold-card p-5 hover:shadow-gold transition">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-gold-500/15 text-gold-400 grid place-items-center">{c.icon}</div>
                <div className="font-display text-2xl text-gold-400">{c.k}</div>
              </div>
              <h3 className="font-bold text-lg mt-3">{c.title}</h3>
              <p className="text-sm text-zinc-400">{c.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer/>
    </>
  );
}
