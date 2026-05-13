"use client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LionMark } from "@/components/LionMark";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Crown, BarChart3, Newspaper, Building2, Shield, Zap, LineChart, Brain, Globe } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function HomePage() {
  const { t, locale } = useI18n();
  const features = [
    { icon: <Brain size={20}/>,    title: "ذكاء اصطناعي بالكامل",
      desc: "كل التحليل يعمل بخوارزميات AI متقدمة لحظيًا، لا تدخل بشري ولا قرارات ذاتية — نتائج دقيقة وسريعة وصحيحة." },
    { icon: <BarChart3 size={20}/>,title: "23 أداة + 48 مدرسة + 54 مؤشر",
      desc: "حصر شامل لكل مدارس وأدوات ومؤشرات التحليل الفني العالمي — جميع المدارس والأدوات مغطاة بالكامل." },
    { icon: <Newspaper size={20}/>,title: "تحليل أساسي شامل",
      desc: "40 مؤشر اقتصادي + الأخبار المالية اللحظية + التصريحات والخطابات + تغريدات صناع القرار والمحافظين." },
    { icon: <Building2 size={20}/>,title: "تتبّع صناع السوق والحيتان",
      desc: "Whale Tracker • Real-Time Money Flow • Order Flow & Bookmap بأسماء المؤسسات الحقيقية والمعاملات الكبرى." },
    { icon: <Shield size={20}/>,   title: "إدارة مخاطر صارمة متعددة الطبقات",
      desc: "Risk:Reward 1:3 إلزامي • SL ديناميكي بـ ATR • Trailing Stop تلقائي • حظر الدخول 30 دقيقة قبل وبعد الأخبار الكبرى." },
    { icon: <Zap size={20}/>,      title: "مضاربة سريعة لحظية",
      desc: "Scalping متعدد الأطر الزمنية — قرار خلال ثانية واحدة عند توافق ≥75% Confluence Score من كل الجداول." },
    { icon: <LineChart size={20}/>,title: "بوت آلي + تداول يدوي",
      desc: "زرّ واحد لتشغيل البوت الآلي الكامل أو زرّ شراء/بيع يدوي — كلاهما يعمل على نفس التحليل والنتائج." },
    { icon: <Globe size={20}/>,    title: "12 لغة عالمية",
      desc: "تبديل لحظي بين 12 لغة عالمية بدون إعادة تحميل — العربية الكاملة من اليمين لليسار مع دعم RTL." },
  ];
  const tablesPreview = [
    { num: 1, title: "جدول خيارات المتداول",
      desc: "اختر الأصل المراد تداوله، نسبة المخاطرة، الإطار الزمني، ورأس المال — تتفاعل مع باقي الجداول لحظيًا." },
    { num: 2, title: "جدول التحليل الأساسي والتقويم الاقتصادي", weight: "20%",
      desc: "ثلاثة أقسام: 40+ مؤشر اقتصادي + الأخبار والتقارير المالية + الخطابات والتصريحات والتغريدات." },
    { num: 3, title: "جدول الأدوات الرئيسية الأساسية", weight: "30%",
      desc: "23 أداة تحليل فني: SMC/ICT، Order Blocks، Liquidity، Fibonacci، EMA/SMA، Supply & Demand، Pivot Points وغيرها." },
    { num: 4, title: "جدول جميع مدارس التحليل الفني", weight: "25%",
      desc: "48 مدرسة عالمية: Dow Theory، Wyckoff، Elliott Wave، Gann، VSA، Harmonics، IPDA، AI/ML وكل مدارس التحليل." },
    { num: 5, title: "جدول المؤشرات الفنية", weight: "10%",
      desc: "54 مؤشر فني: MACD، Bollinger Bands، Ichimoku، VWAP، ATR، RSI، Stochastic، Supertrend وكل المؤشرات." },
    { num: 6, title: "جدول تدفق الأوامر والبوك ماب والسيولة", weight: "15%",
      desc: "Whale Tracker + Real-Time Money Flow + Footprint Chart + DOM Level 2 + Iceberg Orders + ARC Technology." },
    { num: 7, title: t("tables.t7.title"),
      desc: locale === "ar"
        ? "دمج كل الجداول الخمسة → محرك تصويت بالأوزان الكاملة → قرار Buy Lion أو Sell Lion بمستويات Crown / Strong / Weak."
        : "Merging all five tables via weighted vote engine → Buy Lion / Sell Lion at Crown / Strong / Weak tiers." },
    { num: 8, title: "جدول خطة التداول والمخاطرة",
      desc: "Entry • TP1/TP2/TP3/TP4 • SL • R:R 1:3 • Trailing Stop • حجم اللوت • نقاط الدخول على الشارت تلقائيًا." },
  ];

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_-10%,rgba(212,175,55,0.18),transparent_60%)]"/>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 items-center gap-10">
          <div>
            <div className="inline-flex items-center gap-2 chip-tier-S mb-5">
              <Crown size={14}/> {t("hero.badge")}
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight flex items-center gap-3">
              <LionMark size={56} priority/>
              <span className="gold-text">{t("hero.title")}</span>
            </h1>
            <div className="text-2xl md:text-3xl text-white mt-2">The Market Lion</div>
            <div className="text-base text-gold-500/80 mt-1">روبوت ومؤشر رزان للتداول بالذكاء الاصطناعي</div>
            <div className="text-sm text-zinc-500 mt-0.5">Razan AI Trading Platform — Bot & Indicator & Analysis</div>
            <p className="mt-5 text-lg text-zinc-300 leading-loose">{t("hero.subtitle")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup"    className="btn-gold">{t("hero.cta_primary")} <ArrowLeft size={18}/></Link>
              <Link href="/dashboard" className="btn-ghost">{t("hero.cta_secondary")}</Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> {t("hero.check_1")}</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> {t("hero.check_2")}</div>
              <div className="flex items-center gap-2"><Check size={16} className="text-green-400"/> {t("hero.check_3")}</div>
            </div>
          </div>
          <div className="relative">
            <div className="gold-card p-6">
              <Image src="/logo/market-lion-logo.jpg" alt="أسد السوق — The Market Lion" width={620} height={620}
                className="rounded-xl ring-2 ring-gold-500/40 shadow-gold w-full h-auto" priority/>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center gold-text mb-3">قوة المنصة</h2>
        <p className="text-center text-zinc-400 max-w-2xl mx-auto mb-12">
          منصة شاملة تجمع كل ما يحتاجه المتداول — من التحليل الأساسي والفني المتكامل إلى التنفيذ الآلي الذكي.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="gold-card p-5">
              <div className="w-10 h-10 rounded-lg bg-gold-500/15 text-gold-400 flex items-center justify-center mb-3">{f.icon}</div>
              <h3 className="font-bold text-gold-400 mb-1.5">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tables Preview */}
      <section id="how" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl md:text-4xl text-center gold-text mb-3">الجداول الثمانية للتحليل</h2>
        <p className="text-center text-zinc-400 max-w-3xl mx-auto mb-12">
          ثمانية جداول تعمل سويًا في الوقت الفعلي. كل جدول يأخذ نسبته الموزونة وتُجمع نتائج الجميع
          في محرك التصويت → قرار نهائي Buy Lion أو Sell Lion.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {tablesPreview.map(tb => (
            <div key={tb.num} className="gold-card p-5 flex gap-4 items-start">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gold-500/15 text-gold-400 grid place-items-center font-display text-xl">{tb.num}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gold-400">{tb.title}</h3>
                  {tb.weight && <span className="chip-tier-S">وزن {tb.weight}</span>}
                </div>
                <p className="text-sm text-zinc-400 mt-1">{tb.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl md:text-4xl gold-text mb-4 flex items-center justify-center gap-3">
          <LionMark size={40}/> جاهز لتنطلق مع أسد السوق؟
        </h2>
        <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
          سجّل الآن واربط حسابك على أي وسيط خلال دقائق وابدأ التداول الذكي اللحظي.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/signup"  className="btn-gold">ابدأ الاشتراك</Link>
          <Link href="/dashboard" className="btn-ghost">جرّب المنصة مجانًا</Link>
          <Link href="/contact" className="btn-ghost">تواصل مع المبيعات</Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
