import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PriceTicker } from "@/components/PriceTicker";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Crown, BarChart3, BookOpen, Zap, Shield, Globe, LineChart, Brain, BadgeDollarSign, Newspaper, Building2 } from "lucide-react";

const features = [
  { icon: <Brain size={20}/>, title: "ذكاء اصطناعي بالكامل", desc: "كل التحليل يعمل بخوارزميات AI متقدمة لحظيًا، لا تدخل بشري ولا قرارات ذاتية." },
  { icon: <BarChart3 size={20}/>, title: "23 أداة + 48 مدرسة + 54 مؤشر", desc: "حصر شامل لكل مدارس وأدوات ومؤشرات التحليل الفني العالمي بدون حذف أو اختصار." },
  { icon: <Newspaper size={20}/>, title: "تحليل أساسي شامل", desc: "100+ مؤشر اقتصادي + الأخبار + التصريحات والخطابات + تغريدات صناع القرار." },
  { icon: <Building2 size={20}/>, title: "تتبّع صناع السوق والحيتان", desc: "Whale Tracker • Real-Time Money Flow • Order Flow & Bookmap بأسماء المؤسسات الحقيقية." },
  { icon: <Shield size={20}/>, title: "إدارة مخاطر صارمة", desc: "Risk:Reward 1:3 إلزامي • SL ديناميكي ATR • Trailing Stop • حظر الدخول حول الأخبار." },
  { icon: <Zap size={20}/>, title: "مضاربة سريعة لحظية", desc: "Scalping متعدد الأطر — قرار خلال ثانية واحدة عند توافق ≥75% Confluence." },
  { icon: <LineChart size={20}/>, title: "بوت آلي + يدوي", desc: "زرّ تشغيل واحد للبوت أو زرّ شراء/بيع يدوي بناء على نفس التحليل." },
  { icon: <Globe size={20}/>, title: "12 لغة عالمية", desc: "تبديل لحظي بدون إعادة تحميل — العربية الكاملة من اليمين لليسار." },
];

const tablesPreview = [
  { num: 1, title: "خيارات المتداول", desc: "اختر الأصل، نسبة المخاطرة، الإطار الزمني، نوع التداول." },
  { num: 2, title: "التحليل الأساسي والتقويم الاقتصادي", weight: "20%", desc: "ثلاثة أقسام: مؤشرات اقتصادية + أخبار + تصريحات وتغريدات." },
  { num: 3, title: "الأدوات الرئيسية الأساسية", weight: "30%", desc: "23 أداة قوية: BOS/CHoCH، SMC/ICT، Order Blocks، Liquidity، Fibonacci…" },
  { num: 4, title: "جميع مدارس التحليل الفني", weight: "25%", desc: "48 مدرسة عالمية: Dow، Wyckoff، Elliott، Gann، VSA، Harmonics، AI/ML…" },
  { num: 5, title: "المؤشرات الفنية", weight: "10%", desc: "54 مؤشر: MACD، Bollinger، Ichimoku، VWAP، ATR، RSI، Supertrend…" },
  { num: 6, title: "تدفق الأوامر، البوك ماب، السيولة", weight: "15%", desc: "Whale Tracker + Real-Time Money Flow + Footprint + DOM L2 + Iceberg…" },
  { num: 7, title: "القرارات النهائية ومحرك التصويت", desc: "دمج كل الجداول → Buy Lion 🦁 / Sell Lion 🦁 بمستويات 👑/🟢/🟡/⚪." },
  { num: 8, title: "خطة التداول والمخاطرة", desc: "Entry • TP1-4 • SL • Trailing • OB • S/D • Fibonacci • تقارير PDF." },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <PriceTicker />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg to-black opacity-90"/>
        <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_-10%,rgba(212,175,55,0.18),transparent_60%)]"/>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 items-center gap-10">
          <div>
            <div className="inline-flex items-center gap-2 chip-tier-S mb-5">
              <Crown size={14}/> النسخة الثالثة v3 — متاحة الآن
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight">
              <span className="gold-text">أسد السوق</span>
              <br/>
              <span className="text-white text-3xl md:text-4xl">The Market Lion 🦁</span>
            </h1>
            <p className="mt-5 text-lg text-zinc-300 leading-loose">
              أول وأكبر وأقوى وأسرع وأذكى منصة <b className="text-gold-400">بوت ومؤشر ومحلل تداول</b> في العالم
              — تعمل بالذكاء الاصطناعي الكامل، تجمع كل أدوات ومدارس ومؤشرات التحليل الأساسي والفني،
              وتنفّذ صفقاتك آليًا بربط مباشر مع حسابك على Exness MT5.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-gold">ابدأ الاشتراك الآن <ArrowLeft size={18}/></Link>
              <Link href="/dashboard" className="btn-ghost">جرّب الواجهة (تجريبي)</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> دفع آمن • MADA • Visa • PayPal</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> Risk:Reward 1:3 إلزامي</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> دعم ٢٤/٧</div>
            </div>
          </div>
          <div className="relative">
            <div className="relative gold-card p-6">
              <Image
                src="/logo/market-lion-logo.jpg"
                alt="Market Lion logo"
                width={620} height={620}
                className="rounded-xl ring-2 ring-gold-500/40 shadow-gold w-full h-auto"
                priority
              />
              <div className="absolute -bottom-4 -start-4 bg-bg-card gold-border rounded-xl p-3 text-xs">
                <div className="text-gold-400 font-bold">Confluence Score</div>
                <div className="text-2xl font-bold text-green-400">78%</div>
                <div className="text-zinc-400">Buy Lion 🦁🟢</div>
              </div>
              <div className="absolute -top-4 -end-4 bg-bg-card gold-border rounded-xl p-3 text-xs">
                <div className="text-gold-400 font-bold">XAU/USD</div>
                <div className="text-lg font-bold text-zinc-100">2,054.32</div>
                <div className="text-green-400">+0.42%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center gold-text mb-3">قوة المنصة</h2>
        <p className="text-center text-zinc-400 max-w-2xl mx-auto mb-12">منصة شاملة لكل ما يحتاجه المتداول من تحليل أساسي وفني وتنفيذ آلي، بدون أخطاء بشرية.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="gold-card p-5 hover:shadow-gold transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-gold-500/15 text-gold-400 flex items-center justify-center mb-3">{f.icon}</div>
              <h3 className="font-bold text-gold-400 mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How (Tables) */}
      <section id="how" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center gold-text mb-3">كيف يعمل التحليل</h2>
        <p className="text-center text-zinc-400 max-w-3xl mx-auto mb-12">
          ثمانية جداول تعمل سويًا. كل جدول يأخذ نسبته الموزونة، ويعطي قراره في كل إطار زمني،
          وتُجمع نتائج الجميع في محرك التصويت الكلي → قرار نهائي Buy Lion 🦁 أو Sell Lion 🦁.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {tablesPreview.map(t => (
            <div key={t.num} className="gold-card p-5 flex gap-4 items-start">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gold-500/15 text-gold-400 grid place-items-center font-display text-xl">{t.num}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gold-400">{t.title}</h3>
                  {t.weight && <span className="chip-tier-S">وزن {t.weight}</span>}
                </div>
                <p className="text-sm text-zinc-400 mt-1">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center gold-text mb-3">الأسعار والاشتراكات</h2>
        <p className="text-center text-zinc-400 mb-12">باقات مرنة للأفراد والمؤسسات بنفس قوة المنصة الكاملة.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="gold-card p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-2xl text-gold-400">باقة الأفراد</h3>
              <span className="chip-tier-A">شهري</span>
            </div>
            <div className="my-5 text-4xl font-display gold-text">2,000 <span className="text-base text-zinc-400 font-sans">ريال سعودي / شهر</span></div>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> شخص واحد + محفظة تداول واحدة</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> كل الجداول الثمانية كاملة</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> ربط مباشر مع Exness MT5</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> تقارير PDF يومية / أسبوعية / شهرية</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> دعم فني 24/7</li>
            </ul>
            <Link href="/signup?plan=individual" className="btn-gold w-full mt-7">اشترك الآن</Link>
          </div>
          <div className="gold-card p-7 ring-2 ring-gold-500/40 shadow-gold">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-2xl text-gold-400">باقة المؤسسات</h3>
              <span className="chip-tier-S"><Crown size={12}/> الأكثر طلباً</span>
            </div>
            <div className="my-5 text-4xl font-display gold-text">6,000 <span className="text-base text-zinc-400 font-sans">ريال سعودي / شهر</span></div>
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> مؤسسة + محفظة تداول واحدة</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> كل ميزات باقة الأفراد</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> دعم تنفيذي مخصص</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> SLA و تقارير مخصصة</li>
              <li className="flex items-center gap-2"><Check size={16} className="text-green-400"/> تكامل مع أنظمة المؤسسة</li>
            </ul>
            <Link href="/signup?plan=institution" className="btn-gold w-full mt-7">اشترك للمؤسسات</Link>
          </div>
        </div>
        <p className="text-center text-xs text-zinc-500 mt-6">
          الدفع آمن عبر MADA, PayPal, Visa, Mastercard, Apple Pay, PayTabs. ضمان استرداد ٧ أيام.
        </p>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl gold-text mb-4">جاهز لتنطلق مع أسد السوق؟ 🦁</h2>
        <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">سجّل الآن واربط حسابك على Exness خلال دقائق وابدأ التداول الذكي اللحظي.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/signup" className="btn-gold">ابدأ مجانًا اليوم</Link>
          <Link href="/contact" className="btn-ghost">تواصل مع المبيعات</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
