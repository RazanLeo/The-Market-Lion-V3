"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/I18nProvider";

export default function Refund() {
  const { t } = useI18n();
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14 text-zinc-300 leading-loose space-y-6">
        <h1 className="font-display gold-text text-3xl">{t("refund.title")}</h1>
        <p className="text-zinc-400">{t("policy.last_updated")}</p>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">١) ضمان 7 أيام</h2>
          <p>إذا اشتركت لأول مرة، يمكنك طلب استرداد كامل خلال 7 أيام من تاريخ الدفع، بشرط ألا تكون قد نفّذت أكثر من 10 صفقات عبر البوت.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٢) كيفية طلب الاسترداد</h2>
          <p>أرسل بريداً إلى <code className="text-gold-400">support@themarketlion.com</code> برقم الفاتورة. نُعالج الطلب خلال 5 أيام عمل.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٣) عدم الاسترداد</h2>
          <ul className="list-disc pe-6 space-y-1">
            <li>بعد فترة الـ 7 أيام.</li>
            <li>إذا تم استخدام البوت لتنفيذ أكثر من 10 صفقات حقيقية.</li>
            <li>في حال انتهاك شروط الاستخدام.</li>
          </ul></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٤) إيقاف الاشتراك</h2>
          <p>عند عدم تجديد الاشتراك والدفع يتوقف الحساب تلقائيًا إلى أن يدفع. لا يتم تجديد تلقائي بدون إذنك.</p></section>

        <section><h2 className="text-gold-400 font-bold text-xl mb-2">٥) طرق استرداد المبالغ</h2>
          <p>يُرد المبلغ بنفس طريقة الدفع الأصلية (MADA, Visa, Mastercard, PayPal, Apple Pay).</p></section>
      </main>
      <Footer/>
    </>
  );
}
