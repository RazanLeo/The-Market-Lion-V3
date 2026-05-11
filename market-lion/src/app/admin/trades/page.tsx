import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = { title: "إدارة الصفقات" };
export default function Trades() {
  return (
    <>
      <Header variant="app"/>
      <main className="max-w-6xl mx-auto px-5 py-8">
        <h1 className="font-display gold-text text-2xl mb-4">إدارة الصفقات</h1>
        <div className="gold-card p-6 text-zinc-300">قائمة الصفقات المفتوحة والمغلقة لكل المستخدمين.</div>
      </main>
      <Footer/>
    </>
  );
}
