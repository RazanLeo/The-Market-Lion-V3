import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = { title: "كتيّب الاستخدام — The Market Lion" };

export default function Manual() {
  return (
    <>
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl mb-6">كتيّب الاستخدام</h1>
        <ol className="space-y-4 text-zinc-300 leading-loose list-decimal pe-5">
          <li>سجّل حسابك من <span className="text-gold-400">/signup</span> وأدخل بيانات حساب MT5.</li>
          <li>ادفع اشتراك الباقة وفعّل الحساب.</li>
          <li>افتح <span className="text-gold-400">/dashboard</span>: ستجد الجداول الثمانية بالترتيب.</li>
          <li>عدّل خياراتك في <b>جدول 1</b> (الأصل، نسبة المخاطرة، الإطار الزمني).</li>
          <li>تابع الإشارات في الجداول 2-6، ثم القرار النهائي في الجدول 7.</li>
          <li>راجع خطة التداول في الجدول 8 (Entry/SL/TPs).</li>
          <li>اضغط <b>زر البوت 🦁</b> للتشغيل الآلي، أو <b>شراء/بيع</b> للتداول اليدوي.</li>
          <li>راجع تقاريرك اليومية/الأسبوعية/الشهرية تلقائيًا في صيغة PDF.</li>
        </ol>
      </main>
      <Footer/>
    </>
  );
}
