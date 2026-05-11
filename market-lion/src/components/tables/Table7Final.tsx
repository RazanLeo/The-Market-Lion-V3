"use client";
import { TIMEFRAMES } from "@/data/timeframes";
import { TABLE_WEIGHTS } from "@/data/weights";
import { TableShell } from "./TableShell";
import type { ConfluenceResult } from "@/lib/confluence";

export function Table7Final({ summaries, confluence }: {
  summaries: { fundamental: any; coreTools: any; schools: any; indicators: any; orderFlow: any };
  confluence: ConfluenceResult;
}) {
  const rows = [
    { label: "جدول ٢ — التحليل الأساسي", w: TABLE_WEIGHTS.fundamental, s: summaries.fundamental },
    { label: "جدول ٣ — الأدوات الرئيسية", w: TABLE_WEIGHTS.coreTools,   s: summaries.coreTools  },
    { label: "جدول ٤ — المدارس الفنية",   w: TABLE_WEIGHTS.schools,     s: summaries.schools    },
    { label: "جدول ٥ — المؤشرات الفنية",  w: TABLE_WEIGHTS.indicators,  s: summaries.indicators },
    { label: "جدول ٦ — تدفق الأوامر",     w: TABLE_WEIGHTS.orderFlow,   s: summaries.orderFlow  },
  ];
  const tierColor = confluence.tier === "CROWN" ? "from-amber-400 to-yellow-500"
    : confluence.tier === "STRONG" ? "from-green-500 to-emerald-600"
    : confluence.tier === "WEAK"   ? "from-yellow-400 to-amber-500"
    : "from-zinc-500 to-zinc-600";
  return (
    <TableShell number={7} title="جدول ٧ — القرارات النهائية ومحرك التصويت الكلي" subtitle="دمج كل الجداول → قرار التصويت النهائي بالإجماع → Buy Lion 🦁 / Sell Lion 🦁">
      <table className="tbl">
        <thead><tr>
          <th>الجدول</th><th>الوزن من ١٠٠٪</th>
          {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
          <th className="text-center">1D</th>
          <th className="text-center">الاتجاه العام</th>
        </tr></thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}>
              <td className="font-semibold">{r.label}</td>
              <td className="text-gold-400 text-center">{r.w}%</td>
              {TIMEFRAMES.map(tf => (
                <td key={tf} className="text-center">{r.s.perTf[tf].toFixed(0)}</td>
              ))}
              <td className="text-center text-gold-400">{r.s.composite.toFixed(2)}</td>
              <td className="text-center">{r.s.composite > 0 ? "↑ صاعد" : r.s.composite < 0 ? "↓ هابط" : "↔ عرضي"}</td>
            </tr>
          ))}
          <tr className="bg-gold-500/5">
            <td className="font-bold text-gold-400">الإجمالي / النتيجة</td>
            <td className="text-center text-gold-400">100%</td>
            {TIMEFRAMES.map(tf => (
              <td key={tf} className="text-center font-bold">
                {confluence.perTf[tf].toFixed(0)}
              </td>
            ))}
            <td className="text-center font-bold text-gold-400">{confluence.daily.toFixed(2)}</td>
            <td className="text-center font-bold">{confluence.direction === "BUY" ? "Buy 🟢" : confluence.direction === "SELL" ? "Sell 🔴" : "—"}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="gold-card p-5">
          <div className="text-xs text-zinc-400">Confluence Score</div>
          <div className={`text-5xl font-display bg-gradient-to-l bg-clip-text text-transparent ${tierColor}`}>{confluence.abs.toFixed(1)}%</div>
          <div className="text-xs text-zinc-400 mt-1">عتبة دخول البوت ≥ 75%</div>
        </div>
        <div className="gold-card p-5">
          <div className="text-xs text-zinc-400">القرار النهائي</div>
          <div className="text-3xl font-bold mt-1">
            {confluence.direction === "BUY"  ? <span className="text-green-400">Buy Lion 🦁🟢</span> :
             confluence.direction === "SELL" ? <span className="text-red-400">Sell Lion 🦁🔴</span> :
             <span className="text-zinc-300">⚪ لا إشارة</span>}
          </div>
          <div className="text-xs mt-1 text-gold-400">{confluence.tierLabelAr} ({confluence.tierLabel})</div>
        </div>
        <div className="gold-card p-5">
          <div className="text-xs text-zinc-400">حالة البوت</div>
          <div className="text-3xl font-bold mt-1">{confluence.shouldBotEnter ? <span className="text-green-400">جاهز للدخول</span> : <span className="text-zinc-300">انتظار</span>}</div>
          <div className="text-xs mt-1 text-zinc-400">+ توافق التحليل الأساسي • بدون أخبار عالية ±30 دقيقة</div>
        </div>
      </div>
    </TableShell>
  );
}
