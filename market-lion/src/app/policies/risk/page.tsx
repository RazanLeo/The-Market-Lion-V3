import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = { title: "risk — The Market Lion" };

export default function Policy() {
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14 prose prose-invert">
        <h1 className="font-display gold-text text-3xl">سياسة risk</h1>
        <p className="text-zinc-300">هذه سياسة ${''}${''}<b>risk</b> الخاصة بمنصة أسد السوق. باستخدامك المنصة فإنك توافق على البنود التالية...</p>
        <p className="text-zinc-400">للمزيد من التفاصيل أو الاستفسار، تواصل معنا عبر صفحة <a className="text-gold-400" href="/contact">التواصل</a>.</p>
      </main>
      <Footer/>
    </>
  );
}
