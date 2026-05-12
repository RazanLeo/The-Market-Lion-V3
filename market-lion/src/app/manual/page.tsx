import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "كتيب الاستخدام — The Market Lion" };

export default function Manual() {
  return (
    <>
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-14 text-zinc-300 leading-loose space-y-6">
        <h1 className="font-display gold-text text-4xl mb-6">كتيّب استخدام منصة أسد السوق</h1>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">١) إنشاء الحساب والاشتراك</h2>
          <ol className="list-decimal pe-6 space-y-2">
            <li>اضغط على «اشترك الآن» في رأس الصفحة.</li>
            <li>أدخل الاسم الكامل، البريد، رقم الجوال، الدولة، التوقيت، اللغة المفضلة.</li>
            <li>اختر باقة الاشتراك: الأفراد (2,000 ﷼/شهر) أو المؤسسات (6,000 ﷼/شهر).</li>
            <li>أدخل بيانات حساب التداول لديك: الوسيط (Exness, Capital.com, IC Markets, Pepperstone, ...)، البروتوكول (MT4/MT5/cTrader)، رقم الحساب (Login)، السيرفر، كلمة سر Investor، ورأس المال.</li>
            <li>أكمل الدفع بأي طريقة مدعومة: MADA, PayPal, Visa, Mastercard, Apple Pay.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">٢) دخول لوحة التداول</h2>
          <p>بعد التفعيل، انتقل إلى <code className="text-gold-400">/dashboard</code>. ستجد:</p>
          <ul className="list-disc pe-6 space-y-1">
            <li>شارت TradingView مباشر بكل المؤشرات والرسوم.</li>
            <li>الجدول ١ — خيارات المتداول: عدّل الأصل، نسبة المخاطرة، رأس المال، الإطار الزمني، نوع التداول.</li>
            <li>الجدول ٢ — التحليل الأساسي اللحظي (٤٠ مؤشر + ١٢ خبر + ١٢ تصريح).</li>
            <li>الجداول ٣، ٤، ٥، ٦ — التحليل الفني الشامل.</li>
            <li>الجدول ٧ — القرار النهائي Buy/Sell Lion.</li>
            <li>الجدول ٨ — خطة التداول الكاملة.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">٣) تشغيل البوت الآلي</h2>
          <ol className="list-decimal pe-6 space-y-2">
            <li>تأكد من اختياراتك في الجدول ١.</li>
            <li>راجع القرار النهائي في الجدول ٧ — تأكد من Confluence Score ≥ ٧٥٪.</li>
            <li>اضغط زر «تشغيل بوت أسد السوق» الذهبي.</li>
            <li>الزر يتحول للون الأحمر — البوت يعمل ويفتح الصفقات تلقائيًا.</li>
            <li>كل صفقة تُفتح بـ SL تلقائي + ٤ أهداف (TP1-TP4) + Trailing Stop.</li>
            <li>لإيقاف البوت: اضغط الزر مرة ثانية.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">٤) التداول اليدوي</h2>
          <p>إذا اخترت «التداول اليدوي» في الجدول ١:</p>
          <ul className="list-disc pe-6 space-y-1">
            <li>راجع التحليل الكامل في الجداول.</li>
            <li>عند ظهور إشارة Buy Lion 🟢 — اضغط زر «شراء يدوي» الأخضر.</li>
            <li>عند Sell Lion 🔴 — اضغط زر «بيع يدوي» الأحمر.</li>
            <li>المنصة تُحدّد SL وTP تلقائيًا حسب الجدول ٨.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">٥) التقارير</h2>
          <p>يتم توليد تقارير PDF تلقائيًا:</p>
          <ul className="list-disc pe-6 space-y-1">
            <li><b className="text-gold-400">يومي</b>: ملخص آخر يوم تداول.</li>
            <li><b className="text-gold-400">أسبوعي</b>: مقارنات وأداء + رسوم بيانية.</li>
            <li><b className="text-gold-400">شهري</b>: شامل + حساب ضرائب الأرباح.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-gold-400 text-2xl font-bold mb-3">٦) أمان الحساب</h2>
          <ul className="list-disc pe-6 space-y-1">
            <li>كلمة سرّك مشفّرة (Argon2) — لا أحد يمكنه قراءتها.</li>
            <li>بيانات حساب التداول مشفّرة AES-256 في قاعدة البيانات.</li>
            <li>كل صفقات البوت تُسجَّل في سجل تدقيق مرئي لك.</li>
            <li>يمكنك فصل البوت في أي ثانية.</li>
          </ul>
        </section>
      </main>
      <Footer/>
    </>
  );
}
