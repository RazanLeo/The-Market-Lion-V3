"use client";
import { useState, useEffect, useCallback } from "react";
import { TIMEFRAMES, type Timeframe } from "@/data/timeframes";
import { DecisionPill, TierChip } from "./TableShell";
import { InfoButton } from "../InfoModal";
import type { RowReport } from "@/lib/analysisEngine";

export type EnrichedRow = RowReport & {
  category?: string;
  description?: string;
  tier?: "S"|"A"|"B"|"C";
  chartButtonText?: string;
};

// Map from indicator nameEn → TradingView study identifier
const TV_STUDY: Record<string, string> = {
  // Trend
  "Parabolic SAR":          "PSAR@tv-basicstudies",
  "Supertrend":             "Supertrend@tv-basicstudies",
  "WMA":                    "MAWeighted@tv-basicstudies",
  "HMA":                    "HullMA@tv-basicstudies",
  "VWMA":                   "VWMA@tv-basicstudies",
  "DEMA":                   "DEMA@tv-basicstudies",
  "TEMA":                   "TEMA@tv-basicstudies",
  "KAMA":                   "KAMA@tv-basicstudies",
  "ALMA":                   "ALMA@tv-basicstudies",
  "EMA":                    "MAExp@tv-basicstudies",
  "SMA":                    "MASimple@tv-basicstudies",
  // Momentum
  "MACD":                   "MACD@tv-basicstudies",
  "RSI":                    "RSI@tv-basicstudies",
  "Stochastic Oscillator":  "Stoch@tv-basicstudies",
  "Stochastic RSI":         "SMIErgodicIndicator@tv-basicstudies",
  "ADX + DMI":              "ADX@tv-basicstudies",
  "CCI":                    "CCI@tv-basicstudies",
  "Williams %R":            "WilliamR@tv-basicstudies",
  "ROC":                    "ROC@tv-basicstudies",
  "Momentum":               "Momentum@tv-basicstudies",
  "Awesome Oscillator":     "AwesomeOscillator@tv-basicstudies",
  "Ultimate Oscillator":    "UO@tv-basicstudies",
  "TRIX":                   "TRIX@tv-basicstudies",
  "Aroon":                  "Aroon@tv-basicstudies",
  // Volatility
  "Bollinger Bands":        "BB@tv-basicstudies",
  "ATR":                    "ATR@tv-basicstudies",
  "Keltner Channels":       "KeltnerChannels@tv-basicstudies",
  "Donchian Channels":      "DonchianChannels@tv-basicstudies",
  // Volume
  "OBV":                    "OBV@tv-basicstudies",
  "MFI":                    "MFI@tv-basicstudies",
  "A/D":                    "Accdist@tv-basicstudies",
  "Chaikin Money Flow":     "CMF@tv-basicstudies",
  "Force Index":            "ForceIndex@tv-basicstudies",
  "Ease of Movement":       "EaseOfMovement@tv-basicstudies",
  // Smart money
  "VWAP":                   "VWAP@tv-basicstudies",
  // Composite
  "Ichimoku Cloud":         "IchimokuCloud@tv-basicstudies",
  "BB %B + Bandwidth":      "BBPowerSqueeze@tv-basicstudies",
  // Core tools / schools (commonly requested)
  "Volume":                 "Volume@tv-basicstudies",
};

function computeSummary(rows: EnrichedRow[]) {
  const totalW = rows.reduce((a, r) => a + Math.abs(r.decision.weighted), 0);
  return TIMEFRAMES.map(tf => {
    let buyW = 0, sellW = 0;
    for (const r of rows) {
      if (r.decision.perTf[tf] === 1)  buyW  += Math.abs(r.decision.weighted);
      if (r.decision.perTf[tf] === -1) sellW += Math.abs(r.decision.weighted);
    }
    const net = buyW - sellW;
    const conf = totalW > 0 ? Math.abs(net) / totalW : 0;
    const dec: "BUY"|"SELL"|"NEUTRAL" = net > 0.015 ? "BUY" : net < -0.015 ? "SELL" : "NEUTRAL";
    return { tf, buyW, sellW, net, conf, dec };
  });
}

export function RowVoteTable({ rows, weightLabel, totalWeightPct }:
  { rows: EnrichedRow[]; weightLabel: string; totalWeightPct: number }) {
  const summary = computeSummary(rows);

  return (
    <div>
      <table className="tbl">
        <thead>
          <tr>
            <th>الرقم</th>
            <th>الأداة / المدرسة / المؤشر</th>
            <th>التصنيف</th>
            <th>شرح الأداة</th>
            {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th>توافق الأطر</th>
            <th>الوزن من {weightLabel}</th>
            <th>درجة الثقة</th>
            <th>نتيجة التحليل</th>
            <th className="text-center text-[11px]">شارت</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const buyCount     = TIMEFRAMES.filter(tf => r.decision.perTf[tf] === 1).length;
            const sellCount    = TIMEFRAMES.filter(tf => r.decision.perTf[tf] === -1).length;
            const neutralCount = TIMEFRAMES.length - buyCount - sellCount;
            return (
              <tr key={r.id}>
                <td className="text-zinc-400 text-center">{r.id}</td>
                <td className="font-semibold text-zinc-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {r.tier && <TierChip tier={r.tier}/>}
                    <span className="text-sm">{r.nameAr}</span>
                  </div>
                </td>
                <td className="text-zinc-400 text-xs">{r.category || "—"}</td>
                <td className="text-center">
                  <InfoButton title={`شرح الأداة: ${r.nameAr}`}>
                    {r.description ||
                     `الأداة: ${r.nameAr}\nالتصنيف: ${r.category || "—"}\n\nالشرح الكامل لهذه الأداة واستراتيجيتها.`}
                  </InfoButton>
                </td>
                {TIMEFRAMES.map(tf => (
                  <td key={tf} className="text-center">
                    {r.decision.perTf[tf] === 1  ? <span className="text-green-400 font-bold text-xs">شراء</span>
                     : r.decision.perTf[tf] === -1 ? <span className="text-red-400 font-bold text-xs">بيع</span>
                     : <span className="text-zinc-500 text-xs">—</span>}
                  </td>
                ))}
                <td className="text-center text-xs whitespace-nowrap">
                  <span className="text-green-400">{buyCount}</span>
                  <span className="text-zinc-500 mx-0.5">·</span>
                  <span className="text-red-400">{sellCount}</span>
                  <span className="text-zinc-500 mx-0.5">·</span>
                  <span className="text-zinc-400">{neutralCount}</span>
                </td>
                <td className="text-center font-mono text-xs text-zinc-300">
                  {r.decision.weighted >= 0 ? "+" : ""}{r.decision.weighted.toFixed(3)}
                </td>
                <td className="text-center text-gold-400 text-xs">{(r.decision.confidence*100).toFixed(0)}%</td>
                <td className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <DecisionPill d={r.decision.decision}/>
                    <InfoButton title={`نتيجة التحليل — ${r.nameAr}`} dense>
                      {`${r.nameAr}\n\n` +
                       `الدرجة الموزونة: ${r.decision.weighted.toFixed(3)}\n` +
                       `الثقة: ${(r.decision.confidence*100).toFixed(1)}٪\n` +
                       `التوافق: ${(r.decision.alignment*100).toFixed(0)}٪\n` +
                       `شراء: ${buyCount} • بيع: ${sellCount} • محايد: ${neutralCount}\n\n` +
                       `((1M×5)+(5M×10)+(15M×20)+(30M×18)+(1H×22)+(4H×25))÷100`}
                    </InfoButton>
                  </div>
                </td>
                <td className="text-center">
                  <ChartToggle nameEn={r.nameEn} label={r.nameAr}/>
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* ملخص الجدول — حرفي من الإكسيل (صفوف 32-37) */}
        <tfoot>
          <tr className="bg-zinc-900/60 border-t-2 border-gold-500/40">
            <td colSpan={4} className="font-bold text-gold-400 text-xs text-center py-2">
              🎯 القرار النهائي للجدول — الوزن {totalWeightPct}٪
            </td>
            {TIMEFRAMES.map(tf => (
              <td key={tf} className="text-center py-2 text-xs font-bold text-zinc-300">{tf}</td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-zinc-900/40 text-xs">
            <td colSpan={4} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">مجموع أوزان الشراء</td>
            {summary.map(s => (
              <td key={s.tf} className="text-center text-green-400 font-mono">{s.buyW.toFixed(3)}</td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-zinc-900/40 text-xs">
            <td colSpan={4} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">مجموع أوزان البيع</td>
            {summary.map(s => (
              <td key={s.tf} className="text-center text-red-400 font-mono">{s.sellW.toFixed(3)}</td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-zinc-900/40 text-xs">
            <td colSpan={4} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">صافي الدرجة</td>
            {summary.map(s => (
              <td key={s.tf} className={`text-center font-mono font-bold ${s.net > 0 ? "text-green-400" : s.net < 0 ? "text-red-400" : "text-zinc-400"}`}>
                {s.net >= 0 ? "+" : ""}{s.net.toFixed(3)}
              </td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-gold-500/8 text-xs border-t border-gold-500/20">
            <td colSpan={4} className="text-gold-400 py-2 pe-2 text-end font-bold">القرار النهائي</td>
            {summary.map(s => (
              <td key={s.tf} className="text-center py-2">
                {s.dec === "BUY"  ? <span className="chip-buy text-[10px]">شراء 🟢</span>
                 : s.dec === "SELL" ? <span className="chip-sell text-[10px]">بيع 🔴</span>
                 : <span className="chip-neutral text-[10px]">محايد ⚪</span>}
              </td>
            ))}
            <td colSpan={4}></td>
          </tr>

          <tr className="bg-zinc-900/40 text-xs border-b border-gold-500/20">
            <td colSpan={4} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">درجة الثقة (%)</td>
            {summary.map(s => (
              <td key={s.tf} className="text-center text-gold-400 font-mono">{(s.conf*100).toFixed(1)}%</td>
            ))}
            <td colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// Actual TradingView chart toggle — adds/removes the indicator on the live chart
function ChartToggle({ nameEn, label }: { nameEn: string; label: string }) {
  const [on, setOn] = useState(false);
  const [entityId, setEntityId] = useState<string | null>(null);
  const studyKey = TV_STUDY[nameEn] || null;

  const toggle = useCallback(async () => {
    const widget = (window as any).mlTVWidget;
    if (!studyKey) return; // no TV mapping for this indicator

    if (!on) {
      // Turn on — add indicator to chart
      if (!widget) return;
      try {
        const chart = widget.activeChart ? widget.activeChart() : widget.chart();
        const id = await chart.createStudy(studyKey, false, false);
        setEntityId(String(id));
        setOn(true);
      } catch (e) {
        console.warn("TV createStudy failed", studyKey, e);
      }
    } else {
      // Turn off — remove indicator from chart
      if (widget && entityId) {
        try {
          const chart = widget.activeChart ? widget.activeChart() : widget.chart();
          chart.removeEntity(entityId);
        } catch {}
      }
      setEntityId(null);
      setOn(false);
    }
  }, [on, entityId, studyKey]);

  if (!studyKey) {
    // No TV equivalent — show disabled toggle with tooltip
    return (
      <span className="inline-flex w-9 h-5 rounded-full bg-zinc-800 opacity-30 cursor-not-allowed" title={`${label} — غير متاح على TradingView`}/>
    );
  }

  return (
    <button
      onClick={toggle}
      title={on ? `إيقاف ${label} من الشارت` : `رسم ${label} على الشارت`}
      className={`w-9 h-5 rounded-full relative transition-all duration-200 focus:outline-none
        ${on ? "bg-gold-500" : "bg-zinc-700"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200
        ${on ? "end-0.5" : "start-0.5"}`}/>
    </button>
  );
}
