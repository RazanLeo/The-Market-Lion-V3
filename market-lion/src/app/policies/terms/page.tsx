"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/I18nProvider";

export default function Terms() {
  const { t } = useI18n();
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14 text-zinc-300 leading-loose space-y-6">
        <h1 className="font-display gold-text text-3xl">{t("terms.title")}</h1>
        <p className="text-zinc-400">{t("policy.last_updated")}</p>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">١) قبول الشروط</h2>
          <p>باستخدامك منصة «أسد السوق — The Market Lion» فإنك توافق على هذه الشروط بالكامل. إذا لم توافق، يرجى عدم استخدام المنصة.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٢) طبيعة الخدمة</h2>
          <p>المنصة تقدّم تحليلًا للأسواق المالية بالذكاء الاصطناعي + بوت تداول آلي يربط مباشرة بحساب التداول الخاص بك. المنصة لا تقدّم نصائح استثمارية شخصية ولا تضمن أرباحًا.</p></section>

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
