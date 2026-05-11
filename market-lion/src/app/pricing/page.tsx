import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "الأسعار — The Market Lion" };

export default function Pricing() {
  return (
    <>
      <Header/>
      <main className="max-w-5xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl text-center mb-3">الأسعار والاشتراكات</h1>
        <p className="text-center text-zinc-400 mb-10">باقتان فقط — كاملتان دون قيود في الميزات.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "أفراد", price: "2,000", desc: "شخص + محفظة واحدة", plan: "individual" },
            { name: "مؤسسات", price: "6,000", desc: "مؤسسة + محفظة واحدة", plan: "institution" },
          ].map(p => (
            <div key={p.plan} className="gold-card p-7">
              <h3 className="text-gold-400 font-bold text-2xl">{p.name}</h3>
              <div className="text-4xl gold-text my-4">{p.price} <span className="text-base text-zinc-400">﷼ / شهر</span></div>
              <p className="text-zinc-400 mb-6">{p.desc}</p>
              <Link href={`/signup?plan=${p.plan}`} className="btn-gold w-full">اشترك الآن</Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-500 mt-6">طرق الدفع: MADA · PayPal · Visa · Mastercard · Apple Pay · PayTabs.</p>
      </main>
      <Footer/>
    </>
  );
}
