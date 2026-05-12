import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "شروط الاستخدام — The Market Lion" };

export default function Terms() {
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14 text-zinc-300 leading-loose space-y-6">
        <h1 className="font-display gold-text text-3xl">شروط الاستخدام</h1>
        <p>آخر تحديث: مايو 2026</p>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">١) قبول الشروط</h2>
          <p>باستخدامك منصة «أسد السوق — The Market Lion» فإنك توافق على هذه الشروط بالكامل. إذا لم توافق، يرجى عدم استخدام المنصة.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٢) طبيعة الخدمة</h2>
          <p>المنصة تقدّم تحليلًا للأسواق المالية بالذكاء الاصطناعي + بوت تداول آلي يربط مباشرة بحساب التداول الخاص بك (Exness, Capital.com, أي وسيط آخر). المنصة لا تقدّم نصائح استثمارية شخصية ولا تضمن أرباحًا.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٣) الأصول المدعومة</h2>
          <p>تسعة أصول: الذهب (XAU/USD)، النفط (XTI/USD)، وأزواج الفوركس الرئيسية السبعة (EUR/USD, GBP/USD, USD/JPY, USD/CHF, USD/CAD, AUD/USD, NZD/USD).</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٤) المسؤولية</h2>
          <p>التداول في الأسواق المالية ينطوي على مخاطر. المنصة وفريق الإدارة ورزان توفيق ليسوا مسؤولين عن أي خسائر مالية. أنت المسؤول الوحيد عن قراراتك التداولية ومبلغ مخاطرتك.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٥) الاشتراك والدفع</h2>
          <p>الاشتراك شهري: 2,000 ﷼ للأفراد و 6,000 ﷼ للمؤسسات. عند عدم تجديد الاشتراك يتوقف الحساب تلقائيًا إلى أن يدفع. لا توجد ضمانات للأرباح.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٦) إساءة الاستخدام</h2>
          <p>يُحظر: مشاركة الحساب، الهندسة العكسية للمنصة، استخدامها لأنشطة غير قانونية. أي مخالفة تُلغى معها العضوية فوراً بدون استرداد.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٧) التعديلات</h2>
          <p>يحق لنا تعديل الشروط في أي وقت. التعديلات تسري فور نشرها على الموقع.</p></section>
      </main>
      <Footer/>
    </>
  );
}
