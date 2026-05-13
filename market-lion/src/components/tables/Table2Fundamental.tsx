"use client";
import { useEffect, useState } from "react";
import { TableShell, DecisionPill } from "./TableShell";
import { ECON_FULL, NEWS_FULL, STMT_FULL } from "@/data/fundamental_full";
import { InfoButton } from "../InfoModal";
import { useI18n } from "@/i18n/I18nProvider";

const TF = ["1M","5M","15M","30M","1H","4H"] as const;

type ApiResp = {
  ts: number;
  indicators: any[];
  news: any[];
  statements: any[];
};

function ImportancePill({ importance }: { importance: string }) {
  const map: any = {
    VERY_HIGH: "bg-red-500/20 text-red-300 ring-red-500/40",
    HIGH:      "bg-amber-500/20 text-amber-300 ring-amber-500/40",
    MEDIUM:    "bg-sky-500/15 text-sky-300 ring-sky-500/30",
    LOW:       "bg-zinc-500/15 text-zinc-300 ring-zinc-500/30",
  };
  const txt = (importance: string) => {
    if (typeof window === "undefined") return importance;
    const loc = (typeof localStorage !== "undefined" && localStorage.getItem("ml.locale")) || "ar";
    const ar: any = { VERY_HIGH: "عالي جدًا", HIGH: "عالي", MEDIUM: "متوسط", LOW: "منخفض" };
    const en: any = { VERY_HIGH: "Very High", HIGH: "High", MEDIUM: "Medium", LOW: "Low" };
    return (loc === "ar" ? ar : en)[importance] || importance;
  };
  return <span className={`chip ring-1 ${map[importance] || map.LOW}`}>{txt(importance)}</span>;
}

function tfCell(votes: Record<string, number> | undefined, tf: string) {
  const v = votes?.[tf] ?? 0;
  if (v === 1) return <span className="text-green-400 font-bold">شراء</span>;
  if (v === -1) return <span className="text-red-400 font-bold">بيع</span>;
  return <span className="text-zinc-500">—</span>;
}

export function Table2Fundamental({ asset }: { asset: string }) {
  const { t } = useI18n();
  const [data, setData] = useState<ApiResp | null>(null);

  useEffect(() => {
    let live = true;
    async function tick() {
      try {
        const r = await fetch("/api/fundamental", { cache: "no-store" });
        if (r.ok && live) setData(await r.json());
      } catch {}
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => { live = false; clearInterval(id); };
  }, []);

  // Match feed events to our static roster by keyword.
  const matchIndicator = (row: typeof ECON_FULL[0]) =>
    (data?.indicators || []).find((e: any) =>
      e.asset === row.asset && (
        row.indicator.toLowerCase().includes((e.indicator || "").toLowerCase().slice(0, 8)) ||
        (e.indicator || "").toLowerCase().includes(row.indicator.toLowerCase().slice(0, 8))
      )
    );
  const matchNews = (row: typeof NEWS_FULL[0]) =>
    (data?.news || []).find((n: any) =>
      n.asset === row.asset && (
        row.story.split(" ").slice(0, 3).join(" ").toLowerCase().split(" ").some((w: string) => (n.title || "").toLowerCase().includes(w))
      )
    );
  const matchStmt = (row: typeof STMT_FULL[0]) =>
    (data?.statements || []).find((s: any) =>
      (s.speaker || "").toLowerCase().includes(row.speaker.split(" ")[0]?.toLowerCase() || "x")
    );

  return (
    <TableShell number={2}
      title={t("tables.t2.title")}
      subtitle={t("tables.t2.subtitle")}
      weight="20%">

      {/* Section 1 — Economic Indicators (40 rows) */}
      <h4 className="text-gold-400 font-bold mb-2 mt-2">{t("tables.t2.sec1")} — 40 مؤشر اقتصادي • {data ? "متّصل لحظيًا ✓" : "جاري الاتصال…"}</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("common.asset")}</th>
            <th>{t("common.indicator")}</th>
            <th>{t("common.time_utc")}</th>
            <th>{t("common.time_local")}</th>
            <th>{t("common.previous")}</th>
            <th>{t("common.forecast")}</th>
            <th>{t("common.actual")}</th>
            <th>{t("common.importance")}</th>
            <th>{t("common.source")}</th>
            <th>نتيجة التحليل الشامل المفصل</th>
            <th>{t("common.result")}</th>
            {TF.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th>{t("common.weighted_score")}</th>
            <th>{t("common.share_20")}</th>
          </tr>
        </thead>
        <tbody>
          {ECON_FULL.map(row => {
            const live = matchIndicator(row);
            const pol  = live?.polarity ?? 0;
            const dir  = pol > 0 ? "BUY" : pol < 0 ? "SELL" : "NEUTRAL";
            const narrative = live?.narrative || `سيُولَّد التحليل المفصل بالذكاء الاصطناعي عند صدور البيانات اللحظية. هذا المؤشر يقيس: ${row.indicator}. المصدر: ${row.source}. الأهمية: ${row.importance}.`;
            return (
              <tr key={row.id}>
                <td className="text-zinc-400">{row.id}</td>
                <td>{row.asset}</td>
                <td className="font-semibold max-w-[18rem]">{row.indicator}</td>
                <td className="text-zinc-400 whitespace-nowrap">{row.timeUtc}</td>
                <td className="text-zinc-400 whitespace-nowrap">{row.timeLocal}</td>
                <td className="text-zinc-300">{live?.previous ?? "—"}</td>
                <td className="text-zinc-300">{live?.forecast ?? "—"}</td>
                <td className="text-zinc-100 font-bold">{live?.actual ?? "—"}</td>
                <td><ImportancePill importance={row.importance}/></td>
                <td className="text-zinc-400">{row.source}</td>
                <td className="text-center">
                  <InfoButton title={`التحليل المفصل — ${row.indicator}`}>{narrative}</InfoButton>
                </td>
                <td><DecisionPill d={dir as any}/></td>
                {TF.map(tf => <td key={tf} className="text-center">{tfCell(live?.votes, tf)}</td>)}
                <td className="text-center text-zinc-300">{live ? (pol * 0.005).toFixed(3) : "—"}</td>
                <td className="text-center text-gold-400">{live ? ((Math.abs(pol)/40)*20).toFixed(2) + "%" : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Section 2 — News & Reports (12 rows) */}
      <h4 className="text-gold-400 font-bold mb-2 mt-6">{t("tables.t2.sec2")} — 12 خبر/تقرير</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("common.asset")}</th>
            <th>الخبر / التقرير</th>
            <th>التاريخ</th>
            <th>{t("common.time_utc")}</th>
            <th>{t("common.time_local")}</th>
            <th>{t("common.source")}</th>
            <th>{t("common.importance")}</th>
            <th>نتيجة التحليل الشامل المفصل</th>
            <th>{t("common.result")}</th>
            {TF.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th>{t("common.weighted_score")}</th>
            <th>{t("common.share_20")}</th>
          </tr>
        </thead>
        <tbody>
          {NEWS_FULL.map(row => {
            const live = matchNews(row);
            const pol = live?.polarity ?? 0;
            const dir = pol > 0 ? "BUY" : pol < 0 ? "SELL" : "NEUTRAL";
            const narrative = live?.narrative || `سيُولَّد التحليل المفصل بالذكاء الاصطناعي عند صدور الخبر/التقرير. هذا التقرير: ${row.story}. المصدر: ${row.source}. الفترة: ${row.period}.`;
            return (
              <tr key={row.id}>
                <td className="text-zinc-400">{row.id}</td>
                <td>{row.asset}</td>
                <td className="font-semibold max-w-[20rem]">{row.story}</td>
                <td className="text-zinc-400">{row.period}</td>
                <td className="text-zinc-400 whitespace-nowrap">{row.timeUtc}</td>
                <td className="text-zinc-400 whitespace-nowrap">{row.timeLocal}</td>
                <td className="text-zinc-400">{row.source}</td>
                <td><ImportancePill importance={row.importance}/></td>
                <td className="text-center">
                  <InfoButton title={`التحليل المفصل — ${row.story}`}>{narrative}</InfoButton>
                </td>
                <td><DecisionPill d={dir as any}/></td>
                {TF.map(tf => <td key={tf} className="text-center">{tfCell(live?.votes, tf)}</td>)}
                <td className="text-center text-zinc-300">{live ? (pol * 0.005).toFixed(3) : "—"}</td>
                <td className="text-center text-gold-400">{live ? ((Math.abs(pol)/12)*20).toFixed(2) + "%" : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Section 3 — Speeches / Tweets (12 rows) */}
      <h4 className="text-gold-400 font-bold mb-2 mt-6">{t("tables.t2.sec3")} — 12 متحدث</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("common.asset")}</th>
            <th>الخطاب / التصريح / التغريدة</th>
            <th>التاريخ</th>
            <th>{t("common.time_utc")}</th>
            <th>المتحدث</th>
            <th>المنصة</th>
            <th>{t("common.importance")}</th>
            <th>التحليل المفصل + النص الأصلي</th>
            <th>{t("common.result")}</th>
            {TF.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th>{t("common.weighted_score")}</th>
            <th>{t("common.share_20")}</th>
          </tr>
        </thead>
        <tbody>
          {STMT_FULL.map(row => {
            const live = matchStmt(row);
            const pol = live?.polarity ?? 0;
            const dir = pol > 0 ? "BUY" : pol < 0 ? "SELL" : "NEUTRAL";
            const text = live?.text ? `\nالنص الأصلي:\n${live.text}\n\n${live.narrative}` :
              `سيُولَّد التحليل تلقائيًا بالذكاء الاصطناعي عند صدور تصريح/تغريدة من ${row.speaker}.`;
            return (
              <tr key={row.id}>
                <td className="text-zinc-400">{row.id}</td>
                <td>{row.asset}</td>
                <td className="font-semibold max-w-[22rem]">{row.event}</td>
                <td className="text-zinc-400">{row.period}</td>
                <td className="text-zinc-400 whitespace-nowrap">{row.timeUtc}</td>
                <td className="text-zinc-100">{row.speaker}</td>
                <td className="text-zinc-400">{row.channel}</td>
                <td><ImportancePill importance={row.importance}/></td>
                <td className="text-center">
                  <InfoButton title={`${row.event} — ${row.speaker}`}>{text}</InfoButton>
                </td>
                <td><DecisionPill d={dir as any}/></td>
                {TF.map(tf => <td key={tf} className="text-center">{tfCell(live?.votes, tf)}</td>)}
                <td className="text-center text-zinc-300">{live ? (pol * 0.005).toFixed(3) : "—"}</td>
                <td className="text-center text-gold-400">{live ? ((Math.abs(pol)/12)*20).toFixed(2) + "%" : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary tfoot — same structure as RowVoteTable (Excel Sheet 2, rows 32-37) */}
      <FundamentalSummary data={data} asset={asset}/>
    </TableShell>
  );
}

function FundamentalSummary({ data, asset }: { data: ApiResp | null; asset: string }) {
  // Aggregate per-TF votes from all live indicators + news + statements
  const tfTotals: Record<string, { buy: number; sell: number }> = {};
  for (const tf of TF) tfTotals[tf] = { buy: 0, sell: 0 };

  const allLive = [
    ...(data?.indicators  || []),
    ...(data?.news        || []),
    ...(data?.statements  || []),
  ];
  for (const item of allLive) {
    for (const tf of TF) {
      const v = item.votes?.[tf] ?? 0;
      if (v === 1)  tfTotals[tf].buy++;
      if (v === -1) tfTotals[tf].sell++;
    }
  }

  // Composite direction (weighted sum of all per-TF net scores using TF weights)
  const TF_W: Record<string, number> = { "1M": 5, "5M": 10, "15M": 20, "30M": 18, "1H": 22, "4H": 25 };
  let compositeNum = 0, compositeDen = 0;
  for (const tf of TF) {
    const net = tfTotals[tf].buy - tfTotals[tf].sell;
    compositeNum += net * TF_W[tf];
    compositeDen += TF_W[tf];
  }
  const composite = compositeDen > 0 ? compositeNum / compositeDen : 0;
  const total = allLive.length;
  const confidence = total > 0 ? Math.abs(composite) / total : 0;

  const dirText = composite > 0.01 ? "↑ صاعد — شراء" : composite < -0.01 ? "↓ هابط — بيع" : "↔ عرضي — محايد";
  const dirCls  = composite > 0.01 ? "text-green-400" : composite < -0.01 ? "text-red-400" : "text-zinc-400";

  return (
    <div className="mt-6">
      <table className="tbl text-xs">
        <thead>
          <tr className="bg-zinc-900/60 border-t-2 border-gold-500/40">
            <th className="text-gold-400 text-center py-2" colSpan={2}>
              🎯 القرار النهائي — التحليل الأساسي (20٪)
            </th>
            {TF.map(tf => <th key={tf} className="text-center text-zinc-300">{tf}</th>)}
            <th className="text-center text-zinc-300">الاتجاه العام (1D)</th>
            <th className="text-center text-zinc-300">الثقة</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-zinc-900/40">
            <td colSpan={2} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">مجموع أوزان الشراء</td>
            {TF.map(tf => (
              <td key={tf} className="text-center text-green-400 font-mono">{tfTotals[tf].buy}</td>
            ))}
            <td className="text-center text-zinc-400">—</td>
            <td className="text-center text-zinc-400">—</td>
          </tr>
          <tr className="bg-zinc-900/40">
            <td colSpan={2} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">مجموع أوزان البيع</td>
            {TF.map(tf => (
              <td key={tf} className="text-center text-red-400 font-mono">{tfTotals[tf].sell}</td>
            ))}
            <td className="text-center text-zinc-400">—</td>
            <td className="text-center text-zinc-400">—</td>
          </tr>
          <tr className="bg-zinc-900/40">
            <td colSpan={2} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">صافي الدرجة</td>
            {TF.map(tf => {
              const net = tfTotals[tf].buy - tfTotals[tf].sell;
              return (
                <td key={tf} className={`text-center font-mono font-bold ${net > 0 ? "text-green-400" : net < 0 ? "text-red-400" : "text-zinc-400"}`}>
                  {net >= 0 ? "+" : ""}{net}
                </td>
              );
            })}
            <td className="text-center text-gold-400 font-bold font-mono">{composite >= 0 ? "+" : ""}{composite.toFixed(2)}</td>
            <td className="text-center text-gold-400">{(Math.min(confidence * 100, 100)).toFixed(0)}%</td>
          </tr>
          <tr className="bg-gold-500/8 border-t border-gold-500/20">
            <td colSpan={2} className="text-gold-400 py-2 pe-2 text-end font-bold">القرار النهائي</td>
            {TF.map(tf => {
              const net = tfTotals[tf].buy - tfTotals[tf].sell;
              return (
                <td key={tf} className="text-center py-2">
                  {net > 0 ? <span className="chip-buy text-[10px]">شراء 🟢</span>
                   : net < 0 ? <span className="chip-sell text-[10px]">بيع 🔴</span>
                   : <span className="chip-neutral text-[10px]">محايد ⚪</span>}
                </td>
              );
            })}
            <td className={`text-center font-bold ${dirCls}`}>{dirText}</td>
            <td className="text-center text-gold-400">{(Math.min(confidence * 100, 100)).toFixed(0)}%</td>
          </tr>
          <tr className="bg-zinc-900/40 border-b border-gold-500/20">
            <td colSpan={2} className="text-zinc-300 py-1.5 pe-2 text-end font-medium">مساهمة الجدول في القرار النهائي للمنصة</td>
            <td colSpan={6} className="text-center text-gold-400 font-bold">
              {data
                ? `${(Math.abs(composite) / Math.max(total, 1) * 20).toFixed(2)}٪ من 20٪`
                : "جاري الحساب…"
              }
            </td>
            <td colSpan={2} className="text-center text-xs text-zinc-500">الأصل: {asset}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
