"use client";
import { TIMEFRAMES, TF_WEIGHTS } from "@/data/timeframes";
import type { Timeframe } from "@/data/timeframes";
import { TABLE_WEIGHTS } from "@/data/weights";
import { TableShell } from "./TableShell";
import type { ConfluenceResult } from "@/lib/confluence";

function tfDecision(val: number): "BUY" | "SELL" | "NEUTRAL" {
  if (val > 5) return "BUY";
  if (val < -5) return "SELL";
  return "NEUTRAL";
}

function DecisionLabel({ val }: { val: number }) {
  const d = tfDecision(val);
  if (d === "BUY")  return <span className="chip-buy text-[11px]">شراء 🟢</span>;
  if (d === "SELL") return <span className="chip-sell text-[11px]">بيع 🔴</span>;
  return <span className="chip-neutral text-[11px]">محايد ⚪</span>;
}

// Compute bot decision for a specific TF with weighted context
function botDecisionForTf(
  summaries: { fundamental: any; coreTools: any; schools: any; indicators: any; orderFlow: any },
  userTf: Timeframe
): { score: number; direction: "BUY"|"SELL"|"NEUTRAL"; confidence: number } {
  const refTfs = TIMEFRAMES.filter(tf => tf !== userTf);
  const primaryWeight = 0.70;
  const contextWeight = 0.30 / Math.max(refTfs.length, 1);

  const tables = [summaries.fundamental, summaries.coreTools, summaries.schools, summaries.indicators, summaries.orderFlow];
  const tableWts = [TABLE_WEIGHTS.fundamental, TABLE_WEIGHTS.coreTools, TABLE_WEIGHTS.schools, TABLE_WEIGHTS.indicators, TABLE_WEIGHTS.orderFlow];

  let score = 0;
  for (let i = 0; i < tables.length; i++) {
    const primaryScore = tables[i].perTf[userTf] ?? 0;
    let contextScore = 0;
    for (const tf of refTfs) contextScore += (tables[i].perTf[tf] ?? 0) * contextWeight;
    score += (primaryScore * primaryWeight + contextScore) * (tableWts[i] / 100);
  }

  const direction: "BUY"|"SELL"|"NEUTRAL" = score > 5 ? "BUY" : score < -5 ? "SELL" : "NEUTRAL";
  const confidence = Math.min(Math.abs(score), 100);
  return { score, direction, confidence };
}

export function Table7Final({ summaries, confluence, userTf = "15M" }: {
  summaries: { fundamental: any; coreTools: any; schools: any; indicators: any; orderFlow: any };
  confluence: ConfluenceResult;
  userTf?: Timeframe;
}) {
  const rows = [
    { label: "جدول ٢ — التحليل الأساسي",  w: TABLE_WEIGHTS.fundamental, s: summaries.fundamental },
    { label: "جدول ٣ — الأدوات الرئيسية",  w: TABLE_WEIGHTS.coreTools,   s: summaries.coreTools  },
    { label: "جدول ٤ — المدارس الفنية",     w: TABLE_WEIGHTS.schools,     s: summaries.schools    },
    { label: "جدول ٥ — المؤشرات الفنية",    w: TABLE_WEIGHTS.indicators,  s: summaries.indicators },
    { label: "جدول ٦ — تدفق الأوامر",       w: TABLE_WEIGHTS.orderFlow,   s: summaries.orderFlow  },
  ];

  const tierColor = confluence.tier === "CROWN"  ? "from-amber-400 to-yellow-500"
    : confluence.tier === "STRONG" ? "from-green-500 to-emerald-600"
    : confluence.tier === "WEAK"   ? "from-yellow-400 to-amber-500"
    : "from-zinc-500 to-zinc-600";

  const botTf = botDecisionForTf(summaries, userTf);

  return (
    <TableShell number={7}
      title="جدول ٧ — القرارات النهائية ومحرك التصويت الكلي"
      subtitle="دمج كل الجداول → قرار التصويت النهائي بالإجماع → Buy Lion 🦁 / Sell Lion 🦁">

      {/* Main votes table */}
      <div className="overflow-x-auto">
        <table className="tbl text-sm">
          <thead>
            <tr>
              <th>الجدول</th>
              <th>الوزن من ١٠٠٪</th>
              {TIMEFRAMES.map(tf => (
                <th key={tf} className={`text-center ${tf === userTf ? "bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40" : ""}`}>
                  {tf}{tf === userTf ? " ★" : ""}
                </th>
              ))}
              <th className="text-center">الاتجاه العام (1D)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="font-semibold">{r.label}</td>
                <td className="text-gold-400 text-center">{r.w}%</td>
                {TIMEFRAMES.map(tf => {
                  const val = r.s.perTf[tf] ?? 0;
                  return (
                    <td key={tf} className={`text-center ${tf === userTf ? "bg-gold-500/10" : ""}`}>
                      <DecisionLabel val={val}/>
                    </td>
                  );
                })}
                <td className={`text-center font-medium ${r.s.composite > 0 ? "text-green-400" : r.s.composite < 0 ? "text-red-400" : "text-zinc-400"}`}>
                  {r.s.composite > 0.01 ? "↑ صاعد" : r.s.composite < -0.01 ? "↓ هابط" : "↔ عرضي"}
                </td>
              </tr>
            ))}

            {/* Totals row */}
            <tr className="bg-gold-500/5 border-t-2 border-gold-500/30">
              <td className="font-bold text-gold-400">الإجمالي / النتيجة</td>
              <td className="text-center text-gold-400">100%</td>
              {TIMEFRAMES.map(tf => {
                const val = confluence.perTf[tf] ?? 0;
                return (
                  <td key={tf} className={`text-center ${tf === userTf ? "bg-gold-500/15" : ""}`}>
                    <DecisionLabel val={val}/>
                    <div className="text-[9px] text-zinc-500 mt-0.5">{val.toFixed(1)}</div>
                  </td>
                );
              })}
              <td className="text-center font-bold">
                {confluence.direction === "BUY" ? <span className="text-green-400">↑ صاعد</span>
                 : confluence.direction === "SELL" ? <span className="text-red-400">↓ هابط</span>
                 : <span className="text-zinc-400">↔ عرضي</span>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 🎯 Bot decision for selected TF — big prominent card */}
      <div className={`mt-6 p-5 rounded-2xl border-2 ${
        botTf.direction === "BUY"  ? "bg-green-500/10 border-green-500/40" :
        botTf.direction === "SELL" ? "bg-red-500/10 border-red-500/40" :
        "bg-zinc-800/60 border-zinc-600/40"
      }`}>
        <div className="text-xs text-zinc-400 mb-1">🎯 قرار البوت للإطار الزمني المختار: <b className="text-gold-400">{userTf}</b></div>
        <div className="flex items-center gap-6 flex-wrap">
          <div className={`text-4xl font-display font-bold ${
            botTf.direction === "BUY" ? "text-green-400" : botTf.direction === "SELL" ? "text-red-400" : "text-zinc-300"
          }`}>
            {botTf.direction === "BUY" ? "Buy Lion 🦁🟢" : botTf.direction === "SELL" ? "Sell Lion 🦁🔴" : "⚪ انتظار"}
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-gold-400">{botTf.confidence.toFixed(1)}%</div>
            <div className="text-xs text-zinc-400">درجة الثقة لـ{userTf}</div>
          </div>
          <div className="text-xs text-zinc-400 flex-1 min-w-[180px]">
            الدرجة الخام: <b className={botTf.score > 0 ? "text-green-400" : "text-red-400"}>{botTf.score.toFixed(2)}</b>
            <br/>معادلة: 70% {userTf} + 30% الأطر الأخرى
            <br/>عتبة دخول البوت: ≥75٪
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="gold-card p-5">
          <div className="text-xs text-zinc-400">Confluence Score (الكلي)</div>
          <div className={`text-5xl font-display bg-gradient-to-l bg-clip-text text-transparent ${tierColor}`}>
            {confluence.abs.toFixed(1)}%
          </div>
          <div className="text-xs text-zinc-400 mt-1">عتبة دخول البوت الكلية ≥ 75%</div>
        </div>
        <div className="gold-card p-5">
          <div className="text-xs text-zinc-400">القرار النهائي الكلي</div>
          <div className="text-3xl font-bold mt-1">
            {confluence.direction === "BUY"  ? <span className="text-green-400">Buy Lion 🦁🟢</span> :
             confluence.direction === "SELL" ? <span className="text-red-400">Sell Lion 🦁🔴</span> :
             <span className="text-zinc-300">⚪ لا إشارة</span>}
          </div>
          <div className="text-xs mt-1 text-gold-400">{confluence.tierLabelAr} ({confluence.tierLabel})</div>
        </div>
        <div className="gold-card p-5">
          <div className="text-xs text-zinc-400">حالة البوت</div>
          <div className="text-3xl font-bold mt-1">
            {confluence.shouldBotEnter
              ? <span className="text-green-400">جاهز للدخول ✅</span>
              : <span className="text-zinc-300">⏳ انتظار</span>}
          </div>
          <div className="text-xs mt-1 text-zinc-400">
            بدون أخبار عالية ±30 دقيقة • توافق كامل مطلوب
          </div>
        </div>
      </div>
    </TableShell>
  );
}
