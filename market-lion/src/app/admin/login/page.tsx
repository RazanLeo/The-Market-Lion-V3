import { LionMark } from "@/components/LionMark";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Admin — أسد السوق",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  return (
    <main className="min-h-screen grid place-items-center px-4 bg-black">
      <div className="w-full max-w-md gold-card p-8 shadow-gold">
        <div className="flex justify-center mb-5">
          <LionMark size={56} priority/>
        </div>
        <h1 className="text-center font-display gold-text text-2xl mb-0.5 flex items-center justify-center gap-2">
          <ShieldCheck size={20}/> لوحة الإدارة
        </h1>
        <p className="text-center text-zinc-400 text-sm mb-1">أسد السوق — The Market Lion</p>
        <p className="text-center text-zinc-500 text-xs mb-6">للمالك وفريق الإدارة فقط • Owner & Admin team only</p>

        {searchParams?.error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            ⚠️ بيانات الدخول غير صحيحة — Invalid credentials
          </div>
        )}

        <form action="/api/admin/login" method="post" className="space-y-4">
          <div>
            <label className="text-sm text-gold-400 mb-1 block">البريد الإلكتروني / Email</label>
            <input name="email" required type="email" placeholder="razan.tawfiq@gmail.com"
              className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold-500/40"/>
          </div>
          <div>
            <label className="text-sm text-gold-400 mb-1 block">كلمة المرور / Password</label>
            <input name="password" required type="password" placeholder="••••••••"
              className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold-500/40"/>
          </div>
          <button className="btn-gold w-full mt-2">
            <ShieldCheck size={16}/> دخول لوحة الإدارة
          </button>
        </form>
        <p className="text-xs text-zinc-600 text-center mt-6">أي دخول غير مصرح به مسجّل ومحظور.</p>
      </div>
    </main>
  );
}
