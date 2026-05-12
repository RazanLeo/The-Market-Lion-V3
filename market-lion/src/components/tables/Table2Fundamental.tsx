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
  const txt: any = { VERY_HIGH: "عالي جدًا", HIGH: "عالي", MEDIUM: "متوسط", LOW: "منخفض" };
  return <span className={`chip ring-1 ${map[importance] || map.LOW}`}>{txt[importance] || importance}</span>;
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
            <th>{t("common.detailed_analysis")}</th>
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
            <th>{t("common.detailed_analysis")}</th>
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

      <div className="mt-6 gold-card p-4">
        <h4 className="text-gold-400 font-bold mb-2">🎯 الاتجاه العام والقرار النهائي اللحظي للتحليل الأساسي</h4>
        <div className="text-sm text-zinc-300">
          الأصل المختار: <b className="text-gold-400">{asset}</b> • الاتجاه العام لليوم (1D) — يُحسب من تجميع كل التصويتات أعلاه.
        </div>
        <div className="mt-2 text-xs text-zinc-400">
          مساهمة جدول التحليل الأساسي في القرار النهائي للمنصة: <b className="text-gold-400">— من 20٪</b>
        </div>
      </div>
    </TableShell>
  );
}
