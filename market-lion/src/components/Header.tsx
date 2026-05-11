"use client";
import Link from "next/link";
import { Brand } from "./Brand";
import { Globe, LogIn, UserPlus, LayoutDashboard, ShieldCheck } from "lucide-react";

export function Header({ variant = "public" }: { variant?: "public" | "app" }) {
  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur supports-[backdrop-filter]:bg-black/65 border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Brand />
        <nav className="hidden md:flex items-center gap-1 mx-auto text-sm">
          {variant === "public" ? (
            <>
              <Link href="/#features" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">المميزات</Link>
              <Link href="/#how" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">كيف يعمل</Link>
              <Link href="/pricing" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">الأسعار</Link>
              <Link href="/manual" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">كتيّب الاستخدام</Link>
              <Link href="/about" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">عن المنصة</Link>
              <Link href="/contact" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300">التواصل</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300 flex items-center gap-1"><LayoutDashboard size={16}/> لوحة التداول</Link>
              <Link href="/admin" className="px-3 py-2 rounded-lg hover:bg-gold-500/10 text-zinc-300 flex items-center gap-1"><ShieldCheck size={16}/> الإدارة</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2 ms-auto">
          <button title="اللغة" className="p-2 rounded-lg text-gold-400 hover:bg-gold-500/10"><Globe size={18}/></button>
          {variant === "public" ? (
            <>
              <Link href="/login" className="btn-ghost text-sm"><LogIn size={16}/> دخول</Link>
              <Link href="/signup" className="btn-gold text-sm"><UserPlus size={16}/> اشترك الآن</Link>
            </>
          ) : (
            <Link href="/logout" className="btn-ghost text-sm">خروج</Link>
          )}
        </div>
      </div>
    </header>
  );
}
