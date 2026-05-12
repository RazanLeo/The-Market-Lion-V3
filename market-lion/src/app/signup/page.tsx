"use client";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { LionMark } from "@/components/LionMark";
import { UserPlus, ShieldCheck } from "lucide-react";
import { BROKERS } from "@/data/brokers";
import { useState } from "react";

export default function SignupPage() {
  const [broker, setBroker] = useState("exness");
  const b = BROKERS.find(x => x.id === broker) || BROKERS[0];

  return (
    <main className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-2xl gold-card p-8 shadow-gold">
        <div className="flex justify-center mb-6"><Brand size={48}/></div>
        <h1 className="text-center text-2xl font-display gold-text mb-1">سجّل في أسد السوق</h1>
        <p className="text-center text-zinc-400 text-sm mb-6">ابدأ تجربة التداول الذكي خلال دقائق.</p>
        <form action="/api/auth/signup" method="post" className="grid sm:grid-cols-2 gap-4">
          <Field label="الاسم الكامل" name="name" required />
          <Field label="البريد الإلكتروني" name="email" type="email" required />
          <Field label="رقم الجوال" name="phone" />
          <Field label="الدولة / المدينة" name="city" />
          <Field label="التوقيت (Timezone)" name="timezone" placeholder="Asia/Riyadh" />
          <Field label="اللغة المفضلة" name="language" placeholder="ar" />
          <Field label="كلمة المرور" name="password" type="password" required />
          <Field label="تأكيد كلمة المرور" name="passwordConfirm" type="password" required />

          <div className="sm:col-span-2 mt-2 border-t border-gold-500/20 pt-4">
            <h3 className="text-gold-400 font-bold mb-3 flex items-center gap-2"><ShieldCheck size={18}/> بيانات حساب التداول — أي وسيط مدعوم</h3>
            <p className="text-xs text-zinc-400 mb-3">المنصة تربط مباشرة بحسابك بدون وسيط MetaTrader. تدعم MT4, MT5, cTrader, FIX.</p>
          </div>
          <div>
            <label className="text-sm text-gold-400 mb-1 block">الوسيط (Broker)</label>
            <select name="broker" value={broker} onChange={e => setBroker(e.target.value)}
              className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5">
              {BROKERS.map(x => <option key={x.id} value={x.id}>{x.name}{x.primary ? " (موصى)" : ""}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gold-400 mb-1 block">البروتوكول</label>
            <select name="protocol" className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5">
              {b.protocols.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <Field label="رقم الحساب (Login)"  name="brokerLogin" required placeholder="260842468" />
          <Field label="السيرفر (Server)"     name="brokerServer" required placeholder={b.defaultServer || "Broker-Live01"} />
          <Field label="كلمة سر الحساب (Investor)" name="brokerPassword" type="password" required />
          <div>
            <label className="text-sm text-gold-400 mb-1 block">رأس المال ($)</label>
            <input name="capital" type="number" min={100} placeholder="10000"
              className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5"/>
          </div>

          <div className="sm:col-span-2 mt-2 border-t border-gold-500/20 pt-4">
            <h3 className="text-gold-400 font-bold mb-3">اختر الباقة</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="gold-card p-4 cursor-pointer">
                <input type="radio" name="plan" value="INDIVIDUAL_MONTHLY" defaultChecked className="me-2"/>
                <span className="text-gold-400 font-bold">أفراد — 2,000 ﷼ / شهر</span>
                <p className="text-xs text-zinc-400 mt-1">شخص + محفظة واحدة</p>
              </label>
              <label className="gold-card p-4 cursor-pointer">
                <input type="radio" name="plan" value="INSTITUTION_MONTHLY" className="me-2"/>
                <span className="text-gold-400 font-bold">مؤسسات — 6,000 ﷼ / شهر</span>
                <p className="text-xs text-zinc-400 mt-1">مؤسسة + محفظة واحدة</p>
              </label>
            </div>
          </div>

          <label className="sm:col-span-2 flex items-start gap-2 text-sm text-zinc-300">
            <input type="checkbox" name="terms" required className="mt-1"/>
            <span>أوافق على <Link href="/policies/terms" className="text-gold-400">شروط الاستخدام</Link>،
            <Link href="/policies/privacy" className="text-gold-400 ms-1">سياسة الخصوصية</Link>،
            <Link href="/policies/risk" className="text-gold-400 ms-1">إفصاح المخاطر</Link>.</span>
          </label>

          <button className="btn-gold sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2">
            <LionMark size={20}/> إنشاء الحساب والمتابعة للدفع
          </button>
        </form>
        <p className="text-center text-sm text-zinc-400 mt-6">
          لديك حساب؟ <Link href="/login" className="text-gold-400 font-bold">تسجيل الدخول</Link>
        </p>
      </div>
    </main>
  );
}

function Field({ label, name, type = "text", placeholder, required }:
  { label: string; name: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm text-gold-400 mb-1 block">{label}{required && <span className="text-red-400 ms-1">*</span>}</label>
      <input name={name} type={type} required={required} placeholder={placeholder}
        className="w-full bg-bg-card border border-gold-500/25 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-gold-500/40"/>
    </div>
  );
}
