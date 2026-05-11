import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = { title: "إعدادات المنصة" };
export default function Settings() {
  return (
    <>
      <Header variant="app"/>
      <main className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="font-display gold-text text-2xl mb-4">إعدادات المنصة</h1>
        <div className="gold-card p-6 space-y-4 text-zinc-300">
          <div><b className="text-gold-400">اللغات النشطة:</b> العربية، الإنجليزية، البرتغالية البرازيلية، البرتغالية، الكورية، الصينية، الهندية، الإسبانية، الفرنسية، الألمانية، الروسية، التركية</div>
          <div><b className="text-gold-400">السعر — أفراد:</b> 2,000 ﷼/شهر</div>
          <div><b className="text-gold-400">السعر — مؤسسات:</b> 6,000 ﷼/شهر</div>
          <div><b className="text-gold-400">عتبة دخول البوت:</b> ≥ 75% Confluence Score</div>
          <div><b className="text-gold-400">Risk:Reward الأدنى:</b> 1:3</div>
          <div><b className="text-gold-400">حظر الأخبار:</b> ±30 دقيقة حول الأحداث عالية التأثير</div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
