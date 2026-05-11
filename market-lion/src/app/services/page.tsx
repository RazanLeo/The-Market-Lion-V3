import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "الخدمات — The Market Lion" };

export default function Services() {
  const items = [
    { t: "بوت تداول آلي", d: "يفتح ويغلق الصفقات تلقائيًا حسب نظام التصويت بالأوزان." },
    { t: "تداول يدوي ذكي", d: "زر شراء/بيع مباشر مبني على نفس التحليل اللحظي." },
    { t: "محلل شامل لحظي", d: "تحليل أساسي وفني كامل لكل لحظة بكل المدارس والأدوات." },
    { t: "إدارة مخاطر وخطة تداول", d: "حساب الـ Lot، SL، TPs، Trailing Stop، تقارير PDF يومية وأسبوعية وشهرية." },
    { t: "تكامل MT5 / Exness", d: "ربط مباشر بحساب التداول الخاص بك بدون منصة وسيطة." },
    { t: "لوحة تحكم إدارية", d: "للمؤسسات والإدارة — إدارة المستخدمين والاشتراكات والأداء." },
  ];
  return (
    <>
      <Header/>
      <main className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl text-center mb-10">خدماتنا</h1>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((x, i) => (
            <div key={i} className="gold-card p-6">
              <h3 className="text-gold-400 font-bold mb-2">{x.t}</h3>
              <p className="text-sm text-zinc-300">{x.d}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </>
  );
}
