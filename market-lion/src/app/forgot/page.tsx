import { Brand } from "@/components/Brand";
import { LionMark } from "@/components/LionMark";
import { KeyRound } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "استعادة كلمة المرور — The Market Lion" };

export default function ForgotPassword() {
  return (
    <main className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md gold-card p-8 shadow-gold">
        <div className="flex justify-center mb-5"><Brand size={48}/></div>
        <h1 className="text-center font-display gold-text text-2xl mb-1 flex items-center justify-center gap-2">
          <KeyRound size={20}/> استعادة كلمة المرور
        </h1>
        <p className="text-center text-zinc-400 text-sm mb-6">سنرسل لك رابط إعادة التعيين على بريدك.</p>
        <form action="/api/auth/forgot" method="post" className="space-y-4">
          <input name="email" type="email" required placeholder="بريدك الإلكتروني"
            className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <button className="btn-gold w-full inline-flex items-center justify-center gap-2">
            <LionMark size={18}/> إرسال رابط الاستعادة
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          تذكرت كلمتك؟ <Link href="/login" className="text-gold-400 font-bold">عودة للدخول</Link>
        </p>
      </div>
    </main>
  );
}
