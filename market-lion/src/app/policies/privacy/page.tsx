import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "سياسة الخصوصية — The Market Lion" };

export default function Privacy() {
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14 text-zinc-300 leading-loose space-y-6">
        <h1 className="font-display gold-text text-3xl">سياسة الخصوصية</h1>
        <p>آخر تحديث: مايو 2026</p>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">١) البيانات التي نجمعها</h2>
          <ul className="list-disc pe-6 space-y-1">
            <li><b>بيانات الحساب:</b> الاسم، البريد، الجوال، الدولة، التوقيت، اللغة المفضلة.</li>
            <li><b>بيانات حساب التداول:</b> اسم الوسيط، البروتوكول، رقم الحساب، السيرفر، كلمة سر Investor (مشفّرة AES-256).</li>
            <li><b>بيانات الاستخدام:</b> سجل تشغيل البوت، الصفقات المفتوحة، تفضيلات الواجهة.</li>
          </ul></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٢) كيف نستخدم البيانات</h2>
          <p>تشغيل البوت + توليد التقارير + تحسين المنصة + المراسلات الخدمية. لا نبيع بياناتك ولا نشاركها مع طرف ثالث للتسويق.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٣) الأمان</h2>
          <p>تشفير AES-256 لبيانات الوسيط، Argon2 لكلمات المرور، HTTPS إجباري، نسخ احتياطي يومي، 2FA لحساب الإدارة.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٤) حقوقك</h2>
          <p>الوصول، التصحيح، الحذف، تصدير بياناتك. تواصل عبر support@themarketlion.com.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٥) ملفات تعريف الارتباط</h2>
          <p>نستخدم Cookies ضرورية للجلسة + Cookies لحفظ اللغة المفضلة فقط. لا Cookies إعلانية.</p></section>
      </main>
      <Footer/>
    </>
  );
}
