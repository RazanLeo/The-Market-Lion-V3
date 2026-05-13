"use client";
import { useState, useEffect, useCallback } from "react";
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
import { TableFooterSummary } from "@/components/tables/TableFooterSummary";
import { ASSETS } from "@/data/assets";
import { ChatPanel } from "@/components/ChatPanel";
import { PriceTicker } from "@/components/PriceTicker";

export default function DashboardPage() {
  const [options, setOptions] = useState({
    asset: "XAU/USD", riskPct: 2, capital: 10000, tf: "15M", mode: "BOT" as "BOT"|"MANUAL"
  });
  const [computed, setComputed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"live"|"synthetic">("live");
  const [lastRefresh, setLastRefresh] = useState<Date|null>(null);

  const runDashboard = useCallback(async (asset: string, tf: string, capital: number, riskPct: number) => {
    setLoading(true);
    try {
      const [
        analysis,
        { buildLevels, computeLotSize },
        { CORE_TOOLS },
        { SCHOOLS },
        { INDICATORS },
        { CORE_TOOLS_KB },
        { SCHOOLS_KB },
        { INDICATORS_KB },
      ] = await Promise.all([
        // Fetch real analysis from server (Yahoo Finance candles → real indicators)
        fetch(`/api/analysis?symbol=${encodeURIComponent(asset)}`).then(r => r.json()),
        import("@/lib/tradePlan"),
        import("@/data/coreTools"),
        import("@/data/schools"),
        import("@/data/indicators"),
        import("@/data/kb/coreTools_kb"),
        import("@/data/kb/schools_kb"),
        import("@/data/kb/indicators_kb"),
      ]);

      setDataSource(analysis.source === "live" ? "live" : "synthetic");

      // Build price levels from the selected TF's last candle via market data
      const priceResp = await fetch(`/api/prices?symbol=${encodeURIComponent(asset)}`).catch(() => null);
      const priceData = priceResp?.ok ? await priceResp.json() : null;
      const lastPrice = priceData?.price || 2050;
      const atr = priceData?.atr || (asset === "XAU/USD" ? 15 : asset === "XTI/USD" ? 0.8 : 0.0015);

      const direction = analysis.confluence?.direction || "NEUTRAL";
      const { buildLevels: bl, computeLotSize: cl } = { buildLevels, computeLotSize };
      const levels = bl(direction === "NEUTRAL" ? "BUY" : direction, lastPrice, atr);
      const assetDef = ASSETS.find((a: any) => a.symbol === asset) || ASSETS[0];
      const sizing = cl({
        capital, riskPct,
        pipValuePerLot: assetDef.pipValuePerLot,
        stopLossPips: Math.max(1, Math.abs(levels.entry - levels.sl) / 0.0001),
      });

      const enrich = (rows: any[], defs: any[], kb: any, prefix = "") =>
        rows.map((r: any) => {
          const def = defs.find((x: any) => x.id === r.id);
          const kbEntry = kb[r.id];
          const description = kbEntry
            ? `📚 الاستراتيجية:\n${kbEntry.strategy}\n\n📐 صيغة الحساب:\n${kbEntry.calculation}\n\n⚙️ الخوارزمية:\n${kbEntry.algorithm}\n\n💡 مثال تطبيقي:\n${kbEntry.example}`
            : def?.descriptionAr || `${prefix}${def?.nameAr || r.nameAr}`;
          return { ...r, category: def?.category, description, tier: def?.tier };
        });

      const coreRows  = enrich(analysis.tables.coreTools.rows,  CORE_TOOLS,  CORE_TOOLS_KB, "أداة: ");
      const schoolRows = enrich(analysis.tables.schools.rows,   SCHOOLS,     SCHOOLS_KB,    "مدرسة: ");
      const indRows    = enrich(analysis.tables.indicators.rows, INDICATORS,  INDICATORS_KB, "مؤشر: ");

      setComputed({ analysis, levels, sizing, coreRows, schoolRows, indRows, direction, lastPrice });
      setLastRefresh(new Date());
    } catch (e) {
      console.error("dashboard error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + refresh every 60 seconds
  useEffect(() => {
    runDashboard(options.asset, options.tf, options.capital, options.riskPct);
    const id = setInterval(() => runDashboard(options.asset, options.tf, options.capital, options.riskPct), 60_000);
    return () => clearInterval(id);
  }, [options.asset, options.tf, options.capital, options.riskPct, runDashboard]);

  return (
    <>
      <Header variant="app"/>
      <PriceTicker/>
      <TradingViewChart symbol={options.asset} interval={options.tf} height={760}/>
      <main className="max-w-[1600px] mx-auto px-3 md:px-5 py-5 space-y-5">
        {/* Status bar */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 bg-zinc-900/50 rounded-lg px-3 py-1.5">
          <span className={`w-2 h-2 rounded-full ${dataSource === "live" ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`}/>
          <span>{dataSource === "live" ? "بيانات لحظية — Yahoo Finance" : "بيانات تجريبية (تحقق من الاتصال)"}</span>
          {lastRefresh && (
            <span className="ms-auto">آخر تحديث: {lastRefresh.toLocaleTimeString("ar-SA")}</span>
          )}
          <button onClick={() => runDashboard(options.asset, options.tf, options.capital, options.riskPct)}
            className="btn-ghost text-xs py-0.5 px-2 ms-1">🔄 تحديث</button>
        </div>

        <Table1Options onChange={(s) => setOptions(s)}/>
        <Table2Fundamental asset={options.asset}/>

        {loading && (
          <div className="gold-card p-10 text-center">
            <div className="text-3xl mb-3 animate-pulse">🦁</div>
            <div className="text-gold-400 font-bold">⏳ جاري جلب البيانات الحقيقية وحساب التحليل الكامل…</div>
            <div className="text-xs text-zinc-500 mt-2">يتم جلب بيانات {options.asset} من Yahoo Finance وتشغيل الخوارزميات على كل الأطر الزمنية</div>
          </div>
        )}

        {!loading && computed && (<>
          <TableShell number={3} title="جدول ٣ — التحليل الفني / الأدوات الرئيسية الأساسية"
            weight="30%" subtitle="23 أداة — خوارزميات حقيقية على بيانات لحظية">
            <RowVoteTable rows={computed.coreRows} weightLabel="30%" totalWeightPct={30}/>
            <TableFooterSummary tableNumber={3} weightPct={30} summary={computed.analysis.tables.coreTools}/>
          </TableShell>

          <TableShell number={4} title="جدول ٤ — جميع مدارس التحليل الفني"
            weight="25%" subtitle="48 مدرسة عالمية — تحليل آلي بالخوارزميات">
            <RowVoteTable rows={computed.schoolRows} weightLabel="25%" totalWeightPct={25}/>
            <TableFooterSummary tableNumber={4} weightPct={25} summary={computed.analysis.tables.schools}/>
          </TableShell>

          <TableShell number={5} title="جدول ٥ — التحليل الفني / المؤشرات الفنية"
            weight="10%" subtitle="54 مؤشر فني — قراءات آنية">
            <RowVoteTable rows={computed.indRows} weightLabel="10%" totalWeightPct={10}/>
            <TableFooterSummary tableNumber={5} weightPct={10} summary={computed.analysis.tables.indicators}/>
          </TableShell>

          <div>
            <Table6OrderFlow rows={computed.analysis.tables.orderFlow.rows}/>
            <TableFooterSummary tableNumber={6} weightPct={15} summary={computed.analysis.tables.orderFlow}/>
          </div>

          <Table7Final summaries={computed.analysis.tables} confluence={computed.analysis.confluence}/>

          <Table8Plan
            asset={options.asset}
            lots={computed.sizing.lots}
            levels={computed.levels}
            capital={options.capital}
            riskPct={options.riskPct}
            riskAmount={computed.sizing.riskAmount}
            mode={options.mode}
            tf={options.tf}
            direction={computed.direction}
          />
        </>)}

        <ChatPanel context={{
          asset: options.asset, tf: options.tf, mode: options.mode,
          riskPct: options.riskPct, capital: options.capital,
          confluence: computed?.analysis?.confluence,
          dataSource,
        }}/>
      </main>
      <Footer/>
    </>
  );
}
