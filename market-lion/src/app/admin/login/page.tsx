import { Brand } from "@/components/Brand";
import { ShieldCheck } from "lucide-react";

export const metadata = { title: "دخول الإدارة" };
export default function AdminLogin() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md gold-card p-8 shadow-gold">
        <div className="flex justify-center mb-5"><Brand size={48}/></div>
        <h1 className="text-center font-display gold-text text-2xl mb-1 flex items-center justify-center gap-2"><ShieldCheck size={20}/> دخول الإدارة</h1>
        <p className="text-center text-zinc-400 text-sm mb-6">للمالك وفريق الإدارة فقط.</p>
        <form action="/api/auth/admin" method="post" className="space-y-4">
          <input name="email" required type="email" placeholder="البريد"
            className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <input name="password" required type="password" placeholder="كلمة المرور"
            className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <button className="btn-gold w-full">دخول الإدارة</button>
        </form>
      </div>
    </main>
  );
}
