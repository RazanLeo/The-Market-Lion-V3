"use client";
import { useState } from "react";
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
import { runAnalysis, syntheticCandlesAllTf } from "@/lib/analysisEngine";
import { CORE_TOOLS } from "@/data/coreTools";
import { SCHOOLS } from "@/data/schools";
import { INDICATORS } from "@/data/indicators";
import { buildLevels, computeLotSize } from "@/lib/tradePlan";
import { ASSETS } from "@/data/assets";

export default function DashboardPage() {
  const [options, setOptions] = useState({ asset: "XAU/USD", riskPct: 2, capital: 10000, tf: "15M", mode: "BOT" as "BOT"|"MANUAL" });

  const candles = syntheticCandlesAllTf(2050);
  const analysis = runAnalysis(candles);
  const last = candles["15M"].at(-1)!;
  const atr = (Math.max(...candles["15M"].slice(-14).map(c => c.h - c.l))) || 5;
  const direction = analysis.confluence.direction;
  const levels = buildLevels(direction === "NEUTRAL" ? "BUY" : direction, last.c, atr);
  const asset = ASSETS.find(a => a.symbol === options.asset) || ASSETS[0];
  const sizing = computeLotSize({
    capital: options.capital, riskPct: options.riskPct,
    pipValuePerLot: asset.pipValuePerLot,
    stopLossPips: Math.max(1, Math.abs(levels.entry - levels.sl) / 0.0001)
  });

  // Pre-enrich rows with category/description (plain data, no functions across boundary)
  const coreRows = analysis.tables.coreTools.rows.map(r => {
    const t = CORE_TOOLS.find(x => x.id === r.id);
    return { ...r, category: t?.category, description: t?.descriptionAr, tier: t?.tier as any };
  });
  const schoolRows = analysis.tables.schools.rows.map(r => {
    const t = SCHOOLS.find(x => x.id === r.id);
    return { ...r, category: t?.category, tier: t?.tier as any, description: `مدرسة ${t?.nameAr} — منهجية تحليل ${t?.category}.` };
  });
  const indRows = analysis.tables.indicators.rows.map(r => {
    const t = INDICATORS.find(x => x.id === r.id);
    return { ...r, category: t?.category, tier: t?.tier as any, description: `${t?.nameAr} — مؤشر ${t?.category}. يُحسب رياضيًا من الأسعار التاريخية.` };
  });

  return (
    <>
      <Header variant="app"/>
      <main className="max-w-[1600px] mx-auto px-3 md:px-5 py-5 space-y-5">
        <TradingViewChart symbol={options.asset} interval={options.tf}/>
        <Table1Options onChange={(s) => setOptions(s)}/>
        <Table2Fundamental asset={options.asset}/>

        <TableShell number={3} title="جدول ٣ — التحليل الفني / الأدوات الرئيسية الأساسية" weight="30%" subtitle="23 أداة • التحليل الفني الأساسي">
          <RowVoteTable rows={coreRows} weightLabel="30%" totalWeightPct={30}/>
        </TableShell>

        <TableShell number={4} title="جدول ٤ — جميع مدارس التحليل الفني" weight="25%" subtitle="48 مدرسة • حصر شامل لكل مدارس التحليل الفني العالمي">
          <RowVoteTable rows={schoolRows} weightLabel="25%" totalWeightPct={25}/>
        </TableShell>

        <TableShell number={5} title="جدول ٥ — التحليل الفني / المؤشرات الفنية" weight="10%" subtitle="54 مؤشر • Trend / Momentum / Volatility / Volume / Composite">
          <RowVoteTable rows={indRows} weightLabel="10%" totalWeightPct={10}/>
        </TableShell>

        <Table6OrderFlow rows={analysis.tables.orderFlow.rows}/>

        <Table7Final summaries={analysis.tables} confluence={analysis.confluence}/>

        <Table8Plan
          asset={options.asset}
          lots={sizing.lots}
          levels={levels}
          capital={options.capital}
          riskPct={options.riskPct}
          riskAmount={sizing.riskAmount}
          mode={options.mode}
          tf={options.tf}
          direction={direction}
        />
      </main>
      <Footer/>
    </>
  );
}
