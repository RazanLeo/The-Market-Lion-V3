import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = { title: "إدارة الاشتراكات" };
export default function Subs() {
  return (
    <>
      <Header variant="app"/>
      <main className="max-w-6xl mx-auto px-5 py-8">
        <h1 className="font-display gold-text text-2xl mb-4">إدارة الاشتراكات</h1>
        <div className="gold-card p-6">
          <p className="text-zinc-300">سجلّ المدفوعات والاشتراكات النشطة والمتأخرة. يتم التزامن مع بوابات الدفع.</p>
        </div>
      </main>
      <Footer/>
    </>
  );
}
