import { Brand } from "@/components/Brand";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Restricted",
  robots: { index: false, follow: false }, // hidden from search engines
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4 bg-black">
      <div className="w-full max-w-md gold-card p-8 shadow-gold">
        <div className="flex justify-center mb-5"><Brand size={48}/></div>
        <h1 className="text-center font-display gold-text text-2xl mb-1 flex items-center justify-center gap-2">
          <ShieldCheck size={20}/> Administration
        </h1>
        <p className="text-center text-zinc-400 text-sm mb-6">For platform owner and administrators only.</p>
        <form action="/api/admin/login" method="post" className="space-y-4">
          <input name="email" required type="email" placeholder="Email"
            className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <input name="password" required type="password" placeholder="Password"
            className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <input name="otp" required type="text" inputMode="numeric" maxLength={6} placeholder="6-digit 2FA code"
            className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          <button className="btn-gold w-full">Sign in to Admin</button>
        </form>
        <p className="text-xs text-zinc-500 text-center mt-6">Unauthorized access is logged and prohibited.</p>
      </div>
    </main>
  );
}
