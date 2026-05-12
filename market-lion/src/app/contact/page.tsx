import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MessageSquare, Globe } from "lucide-react";

export const metadata = { title: "تواصل معنا — The Market Lion" };

export default function Contact() {
  return (
    <>
      <Header/>
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="font-display gold-text text-4xl text-center mb-3">تواصل معنا</h1>
        <p className="text-center text-zinc-400 mb-10">فريقنا متاح ٢٤/٧ على كل القنوات.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="gold-card p-5"><Mail className="text-gold-400 mb-2" size={20}/><div className="text-zinc-200 font-bold">البريد الإلكتروني</div><div className="text-sm text-zinc-400">support@themarketlion.com</div></div>
          <div className="gold-card p-5"><MessageSquare className="text-gold-400 mb-2" size={20}/><div className="text-zinc-200 font-bold">الدعم الفوري</div><div className="text-sm text-zinc-400">شات داخل المنصة بعد تسجيل الدخول</div></div>
          <div className="gold-card p-5"><Phone className="text-gold-400 mb-2" size={20}/><div className="text-zinc-200 font-bold">للمؤسسات</div><div className="text-sm text-zinc-400">طلب اتصال مخصص عبر النموذج</div></div>
          <div className="gold-card p-5"><Globe className="text-gold-400 mb-2" size={20}/><div className="text-zinc-200 font-bold">المقر</div><div className="text-sm text-zinc-400">المملكة العربية السعودية — الرياض</div></div>
        </div>

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
