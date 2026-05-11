import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = { title: "تواصل معنا — The Market Lion" };

export default function Contact() {
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl text-center mb-3">تواصل معنا</h1>
        <p className="text-center text-zinc-400 mb-10">فريقنا متاح ٢٤/٧.</p>
        <form className="gold-card p-6 grid gap-4" action="/api/contact" method="post">
          <input name="name" required placeholder="الاسم" className="bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <input name="email" type="email" required placeholder="البريد الإلكتروني" className="bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <input name="subject" required placeholder="الموضوع" className="bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <textarea name="message" rows={6} required placeholder="رسالتك" className="bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"></textarea>
          <button className="btn-gold">إرسال الرسالة</button>
        </form>
      </main>
      <Footer/>
    </>
  );
}
