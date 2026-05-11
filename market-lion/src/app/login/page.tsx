import Link from "next/link";
import { Brand } from "@/components/Brand";
import { LogIn } from "lucide-react";

export const metadata = { title: "تسجيل الدخول — The Market Lion" };

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md gold-card p-8 shadow-gold">
        <div className="flex justify-center mb-6"><Brand size={48} /></div>
        <h1 className="text-center text-2xl font-display gold-text mb-1">تسجيل الدخول</h1>
        <p className="text-center text-zinc-400 text-sm mb-6">مرحبًا بعودتك إلى أسد السوق 🦁</p>
        <form action="/api/auth/callback/credentials" method="post" className="space-y-4">
          <input type="hidden" name="csrfToken" />
          <div>
            <label className="text-sm text-gold-400 mb-1 block">البريد الإلكتروني</label>
            <input name="email" type="email" required placeholder="you@example.com"
              className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold-500/40"/>
          </div>
          <div>
            <label className="text-sm text-gold-400 mb-1 block">كلمة المرور</label>
            <input name="password" type="password" required placeholder="••••••••"
              className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold-500/40"/>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" /> تذكرني</label>
            <Link href="/forgot" className="text-gold-400">نسيت كلمة المرور؟</Link>
          </div>
          <button className="btn-gold w-full"><LogIn size={16}/> تسجيل الدخول</button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          لا تملك حسابًا؟ <Link href="/signup" className="text-gold-400 font-bold">اشترك الآن</Link>
        </p>
      </div>
    </main>
  );
}
