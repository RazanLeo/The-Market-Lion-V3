import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "عن المنصة — The Market Lion" };

export default function About() {
  return (
    <>
      <Header/>
      <main className="max-w-4xl mx-auto px-4 py-14 prose prose-invert">
        <h1 className="font-display gold-text text-4xl">عن منصة أسد السوق</h1>
        <p className="text-zinc-300 leading-loose">
          منصة "أسد السوق — The Market Lion" هي أول وأكبر وأقوى وأسرع وأذكى منصة بوت ومؤشر ومحلل تداول
          عالمي تعمل بالذكاء الاصطناعي بالكامل. مصممة لمساعدة جميع المتداولين على التداول الصحيح بدون
          أخطاء وبدون خسائر، بناء على باتفاق كامل لكل أنواع التحليل الأساسي والفني وكل مدارسه وأدواته
          ومؤشراته.
        </p>
        <h2 className="text-gold-400">رؤيتنا</h2>
        <p>أن نصبح المنصة الأولى عالميًا لتداول لحظي ذكي يعتمد على دمج التحليل الأساسي والفني الشامل في قرار واحد قاطع.</p>
        <h2 className="text-gold-400">رسالتنا</h2>
        <p>تمكين كل متداول — مبتدئ أو محترف — من اتخاذ قرارات تداول دقيقة بسرعة فائقة وبأمان عالٍ.</p>
        <h2 className="text-gold-400">أهدافنا</h2>
        <ul>
          <li>تحقيق نسبة نجاح صفقات تستهدف 99%.</li>
          <li>إدارة مخاطر صارمة بنسبة Risk:Reward لا تقل عن 1:3.</li>
          <li>دعم 12 لغة عالمية بتبديل لحظي.</li>
          <li>قابلية التوسع لخدمة ملايين المستخدمين.</li>
        </ul>
      </main>
      <Footer/>
    </>
  );
}
