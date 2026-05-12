import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "إفصاح المخاطر — The Market Lion" };

export default function Risk() {
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14 text-zinc-300 leading-loose space-y-6">
        <h1 className="font-display gold-text text-3xl">إفصاح المخاطر</h1>
        <p className="text-red-400">⚠️ التداول في الأسواق المالية يحمل مخاطر عالية على رأس المال.</p>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">١) طبيعة المخاطر</h2>
          <p>تداول العقود مقابل الفروقات (CFDs) والفوركس والسلع ينطوي على مخاطر عالية بسبب الرفع المالي. قد تخسر أكثر من رأس مالك الأولي. النتائج السابقة لا تضمن النتائج المستقبلية.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٢) عدم ضمان الأرباح</h2>
          <p>على الرغم من أن البوت مصمم ليستهدف نسبة نجاح 99٪ عبر تشديد شروط الدخول (Confluence ≥75-80٪)، لا يمكن لأي منصة ضمان أرباح. الأسواق متقلبة وأحداث غير متوقعة قد تحدث.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٣) قواعد الأمان المدمجة</h2>
          <ul className="list-disc pe-6 space-y-1">
            <li>نسبة المخاطرة القصوى لكل صفقة: 5٪ من رأس المال (تنفيذيًا — حتى لو اخترت 10٪).</li>
            <li>Risk:Reward الأدنى إلزامياً: 1:3.</li>
            <li>البوت لا يدخل صفقة قبل وبعد الأخبار الكبرى بـ 30 دقيقة.</li>
            <li>Stop Loss إلزامي على كل صفقة، يُحسب من ATR + المستويات الفنية.</li>
            <li>Trailing Stop آلي بعد كل TP.</li>
          </ul></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٤) مسؤوليتك</h2>
          <p>أنت المسؤول الوحيد عن قرار استخدام البوت ومبلغ رأس المال المخاطر به ونسبة المخاطرة المختارة. لا تستخدم أموالًا لا تستطيع تحمل خسارتها.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٥) متطلبات تنظيمية</h2>
          <p>تحقق من أن وسيطك (Exness, Capital.com, إلخ) مرخّص في بلدك. المنصة لا تحلّ محل الترخيص التنظيمي للوسيط.</p></section>
      </main>
      <Footer/>
    </>
  );
}
