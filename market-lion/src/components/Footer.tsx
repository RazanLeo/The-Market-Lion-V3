import Link from "next/link";
import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-gold-500/20 bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-10 text-sm">
        <div>
          <Brand />
          <p className="mt-4 text-zinc-400 leading-relaxed">
            منصة بوت ومؤشر ومحلل تداول عالمي بالذكاء الاصطناعي.<br/>
            Razan AI Trading Platform — Bot, Indicator & Analysis.
          </p>
        </div>
        <div>
          <h4 className="text-gold-400 font-bold mb-3">المنصة</h4>
          <ul className="space-y-2 text-zinc-300">
            <li><Link href="/about">عن المنصة</Link></li>
            <li><Link href="/services">الخدمات</Link></li>
            <li><Link href="/pricing">الأسعار والاشتراكات</Link></li>
            <li><Link href="/manual">كتيّب الاستخدام</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold-400 font-bold mb-3">القانوني</h4>
          <ul className="space-y-2 text-zinc-300">
            <li><Link href="/policies/terms">شروط الاستخدام</Link></li>
            <li><Link href="/policies/privacy">سياسة الخصوصية</Link></li>
            <li><Link href="/policies/risk">إفصاح المخاطر</Link></li>
            <li><Link href="/policies/refund">سياسة الاسترداد</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold-400 font-bold mb-3">التواصل والدعم</h4>
          <ul className="space-y-2 text-zinc-300">
            <li><Link href="/contact">صفحة التواصل</Link></li>
            <li>support@themarketlion.com</li>
            <li>الدعم متاح ٢٤/٧</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold-500/15 py-4 text-center text-xs text-zinc-500">
        © 2026 رزان توفيق — جميع الحقوق محفوظة • The Market Lion v3
      </div>
    </footer>
  );
}
