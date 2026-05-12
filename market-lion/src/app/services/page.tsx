import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "الخدمات — The Market Lion" };

export default function Services() {
  const items = [
    { t: "محلل شامل لحظي", d: "تحليل أساسي وفني كامل لحظة بلحظة بكل المدارس وكل الأدوات وكل المؤشرات. ٤٠ مؤشر اقتصادي، ٢٣ أداة فنية، ٤٨ مدرسة، ٥٤ مؤشر، تدفق الأوامر، البوك ماب، صناع السوق والحيتان." },
    { t: "بوت تداول آلي", d: "يفتح ويغلق الصفقات تلقائيًا حسب نظام التصويت بالأوزان. يدخل فقط عند Confluence Score ≥ 75-80٪ + توافق التحليل الأساسي + خلو نافذة الأخبار." },
    { t: "تداول يدوي ذكي", d: "زر شراء/بيع مباشر مبني على نفس التحليل اللحظي، يفتح لك الصفقة مع SL/TP1-TP4 وTrailing Stop تلقائي." },
    { t: "إدارة مخاطر وخطة تداول", d: "حساب اللوت تلقائيًا، SL على ATR + مستويات فنية، ٤ أهداف بنِسَب 1:1, 1:2, 1:3, 1:4، Trailing Stop ينقل SL تلقائيًا." },
    { t: "تكامل مع أي وسيط", d: "Exness، Capital.com، IC Markets، Pepperstone، XM، FBS، FXTM... أي وسيط يدعم MT4/MT5/cTrader/FIX. ربط مباشر بدون منصة وسيطة." },
    { t: "تقارير PDF تلقائية", d: "تقرير يومي وأسبوعي وشهري بصيغة PDF. التقرير الشهري يشمل ضرائب الأرباح + مقارنة الأداء." },
    { t: "١٢ لغة عالمية", d: "العربية (RTL) + الإنجليزية + الإسبانية + البرتغالية + الكورية + الصينية + الهندية + اليابانية + الفرنسية + الألمانية + الروسية + التركية. تبديل لحظي بدون إعادة تحميل." },
    { t: "شات GPT مالي مدمج", d: "مساعد ذكاء اصطناعي مالي مخصص للتداول داخل المنصة، يجيب على أسئلتك حول كل ما يحدث في الجداول والصفقات." },
    { t: "لوحة إدارة مؤسسية", d: "للمالك وفريق الإدارة فقط — منعزلة تمامًا عن المستخدم العادي بـ middleware و2FA و RBAC." },
  ];
  return (
    <>
      <Header/>
      <main className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl text-center mb-3">خدمات أسد السوق</h1>
        <p className="text-center text-zinc-400 mb-12 max-w-3xl mx-auto">
          منصة شاملة تجمع كل ما يحتاجه المتداول الحديث: تحليل + بوت + إدارة مخاطر + تقارير، في قالب فاخر متعدد اللغات.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((x, i) => (
            <div key={i} className="gold-card p-6">
              <h3 className="text-gold-400 font-bold mb-2 text-lg">{x.t}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer/>
    </>
  );
}
