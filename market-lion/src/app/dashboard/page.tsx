"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TradingViewChart } from "@/components/TradingViewChart";
import { Table1Options } from "@/components/tables/Table1Options";
import { Table2Fundamental } from "@/components/tables/Table2Fundamental";
import { Table6OrderFlow } from "@/components/tables/Table6OrderFlow";
import { Table7Final } from "@/components/tables/Table7Final";
import { Table8Plan } from "@/components/tables/Table8Plan";
import { RowVoteTable } from "@/components/tables/RowVoteTable";
import { TableShell } from "@/components/tables/TableShell";
import { ASSETS } from "@/data/assets";
import { ChatPanel } from "@/components/ChatPanel";
import { PriceTicker } from "@/components/PriceTicker";

export default function DashboardPage() {
  const [options, setOptions] = useState({
    asset: "XAU/USD", riskPct: 2, capital: 10000, tf: "15M", mode: "BOT" as "BOT"|"MANUAL"
  });
  const [computed, setComputed] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const [
          { runAnalysis, syntheticCandlesAllTf },
          { buildLevels, computeLotSize },
          { CORE_TOOLS },
          { SCHOOLS },
          { INDICATORS },
          { CORE_TOOLS_KB },
          { SCHOOLS_KB },
          { INDICATORS_KB },
        ] = await Promise.all([
          import("@/lib/analysisEngine"),
          import("@/lib/tradePlan"),
          import("@/data/coreTools"),
          import("@/data/schools"),
          import("@/data/indicators"),
          import("@/data/kb/coreTools_kb"),
          import("@/data/kb/schools_kb"),
          import("@/data/kb/indicators_kb"),
        ]);

        const candles = syntheticCandlesAllTf(2050);
        const analysis = runAnalysis(candles);
        const last = candles["15M"].at(-1)!;
        const atr = (Math.max(...candles["15M"].slice(-14).map((c: any) => c.h - c.l))) || 5;
        const direction = analysis.confluence.direction;
        const levels = buildLevels(direction === "NEUTRAL" ? "BUY" : direction, last.c, atr);
        const asset = ASSETS.find(a => a.symbol === options.asset) || ASSETS[0];
        const sizing = computeLotSize({
          capital: options.capital, riskPct: options.riskPct,
          pipValuePerLot: asset.pipValuePerLot,
          stopLossPips: Math.max(1, Math.abs(levels.entry - levels.sl) / 0.0001),
        });
        const coreRows = analysis.tables.coreTools.rows.map((r: any) => {
          const t = CORE_TOOLS.find((x: any) => x.id === r.id);
          const kb = (CORE_TOOLS_KB as any)[r.id];
          const description = kb
            ? `📚 الاستراتيجية:\n${kb.strategy}\n\n📐 صيغة الحساب:\n${kb.calculation}\n\n⚙️ الخوارزمية:\n${kb.algorithm}\n\n💡 مثال تطبيقي:\n${kb.example}`
            : t?.descriptionAr;
          return { ...r, category: t?.category, description, tier: t?.tier };
        });
        const schoolRows = analysis.tables.schools.rows.map((r: any) => {
          const t = SCHOOLS.find((x: any) => x.id === r.id);
          const kb = (SCHOOLS_KB as any)[r.id];
          const description = kb
            ? `📚 الاستراتيجية:\n${kb.strategy}\n\n📐 صيغة الحساب:\n${kb.calculation}\n\n⚙️ الخوارزمية:\n${kb.algorithm}\n\n💡 مثال:\n${kb.example}`
            : `مدرسة ${t?.nameAr}`;
          return { ...r, category: t?.category, tier: t?.tier, description };
        });
        const indRows = analysis.tables.indicators.rows.map((r: any) => {
          const t = INDICATORS.find((x: any) => x.id === r.id);
          const kb = (INDICATORS_KB as any)[r.id];
          const description = kb
            ? `📚 ${kb.strategy}\n\n📐 ${kb.calculation}\n\n⚙️ ${kb.algorithm}\n\n💡 ${kb.example}`
            : `${t?.nameAr}`;
          return { ...r, category: t?.category, tier: t?.tier, description };
        });

        if (alive) {
          setComputed({ analysis, levels, sizing, coreRows, schoolRows, indRows, direction });
          setLoading(false);
        }
      } catch (e) {
        console.error("dashboard analysis failed", e);
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [options.asset, options.tf, options.capital, options.riskPct]);

  return (
    <>
      <Header variant="app"/>
      <PriceTicker/>
      <TradingViewChart symbol={options.asset} interval={options.tf} height={760}/>
      <main className="max-w-[1600px] mx-auto px-3 md:px-5 py-5 space-y-5">
        <Table1Options onChange={(s) => setOptions(s)}/>
        <Table2Fundamental asset={options.asset}/>

        {loading && (
          <div className="gold-card p-8 text-center text-gold-400">
            ⏳ جاري حساب التحليل الكامل للجداول ٣ و٤ و٥ و٦ و٧ و٨…
          </div>
        )}

        {!loading && computed && (<>
          <TableShell number={3} title="جدول ٣ — التحليل الفني / الأدوات الرئيسية الأساسية" weight="30%" subtitle="23 أداة • التحليل الفني الأساسي">
            <RowVoteTable rows={computed.coreRows} weightLabel="30%" totalWeightPct={30}/>
          </TableShell>
          <TableShell number={4} title="جدول ٤ — جميع مدارس التحليل الفني" weight="25%" subtitle="48 مدرسة عالمية">
            <RowVoteTable rows={computed.schoolRows} weightLabel="25%" totalWeightPct={25}/>
          </TableShell>
          <TableShell number={5} title="جدول ٥ — التحليل الفني / المؤشرات الفنية" weight="10%" subtitle="54 مؤشر">
            <RowVoteTable rows={computed.indRows} weightLabel="10%" totalWeightPct={10}/>
          </TableShell>
          <Table6OrderFlow rows={computed.analysis.tables.orderFlow.rows}/>
          <Table7Final summaries={computed.analysis.tables} confluence={computed.analysis.confluence}/>
          <Table8Plan
            asset={options.asset} lots={computed.sizing.lots} levels={computed.levels}
            capital={options.capital} riskPct={options.riskPct} riskAmount={computed.sizing.riskAmount}
            mode={options.mode} tf={options.tf} direction={computed.direction}
          />
        </>)}

        <ChatPanel context={{
          asset: options.asset, tf: options.tf, mode: options.mode,
          riskPct: options.riskPct, capital: options.capital,
          confluence: computed?.analysis?.confluence,
        }}/>
      </main>
      <Footer/>
    </>
  );
}
