// Analysis engine: runs per-ID deterministic indicator voters for every row
// in every table and computes final confluence (Buy Lion / Sell Lion).
import { TIMEFRAMES, Timeframe } from "@/data/timeframes";
import { CORE_TOOLS } from "@/data/coreTools";
import { SCHOOLS } from "@/data/schools";
import { INDICATORS } from "@/data/indicators";
import { ORDER_FLOW_TOOLS } from "@/data/orderFlow";
import { ECON_INDICATORS } from "@/data/fundamental";
import { buildRowDecision } from "./scoring";
import type { OHLCV, RowDecision } from "./types";
import { combineTables } from "./confluence";

import { CORE_VOTERS }       from "./voters/coreTools";
import { SCHOOL_VOTERS }     from "./voters/schools";
import { INDICATOR_VOTERS }  from "./voters/indicators";
import { ORDER_FLOW_VOTERS } from "./voters/orderFlow";

export type CandlesByTf = Record<Timeframe, OHLCV[]>;

export type RowReport = {
  id: number;
  nameAr: string;
  nameEn: string;
  decision: RowDecision;
};

export type TableReport = {
  rows: RowReport[];
  perTf: Record<Timeframe, number>;
  composite: number;
  confidence: number;
};

const MIN_CANDLES = 30;

function runVoter(
  voterMap: Record<number, (c: OHLCV[]) => -1|0|1>,
  id: number,
  candles: OHLCV[]
): -1|0|1 {
  const voter = voterMap[id];
  if (!voter || candles.length < MIN_CANDLES) return 0;
  try { return voter(candles); }
  catch { return 0; }
}

function buildRowReport(
  id: number,
  nameAr: string,
  nameEn: string,
  table: "coreTools"|"schools"|"indicators"|"orderFlow",
  voterMap: Record<number, (c: OHLCV[]) => -1|0|1>,
  candles: CandlesByTf
): RowReport {
  const perTf: Record<Timeframe, -1|0|1> = {} as any;
  for (const tf of TIMEFRAMES) {
    perTf[tf] = runVoter(voterMap, id, candles[tf] || []);
  }
  const decision = buildRowDecision(perTf, table);
  return { id, nameAr, nameEn, decision };
}

function tableSummary(rows: RowReport[]): TableReport {
  const perTf: Record<Timeframe, number> = {} as any;
  for (const tf of TIMEFRAMES) {
    let s = 0;
    for (const r of rows) s += r.decision.perTf[tf];
    perTf[tf] = rows.length ? (s / rows.length) * 100 : 0;
  }
  const composite = rows.reduce((a, r) => a + r.decision.weighted, 0) / Math.max(rows.length, 1);
  const confidence = rows.reduce((a, r) => a + r.decision.confidence, 0) / Math.max(rows.length, 1);
  return { rows, perTf, composite, confidence };
}

/**
 * Run the full analysis engine.
 *
 * @param candles       - OHLCV data per timeframe (from Yahoo Finance)
 * @param fundamentalVotes - Optional: real per-TF vote aggregated from /api/fundamental
 *                          (-1..+1 float). When absent, fundamental table stays neutral (0).
 *                          This replaces the former MACD-as-macro-proxy hack.
 */
export function runAnalysis(
  candles: CandlesByTf,
  fundamentalVotes?: Partial<Record<Timeframe, number>>
) {
  const coreRows = CORE_TOOLS.map(t =>
    buildRowReport(t.id, t.nameAr, t.nameEn, "coreTools", CORE_VOTERS, candles)
  );
  const schoolRows = SCHOOLS.map(t =>
    buildRowReport(t.id, t.nameAr, t.nameEn, "schools", SCHOOL_VOTERS, candles)
  );
  const indicatorRows = INDICATORS.map(t =>
    buildRowReport(t.id, t.nameAr, t.nameEn, "indicators", INDICATOR_VOTERS, candles)
  );
  const orderFlowRows = ORDER_FLOW_TOOLS.map(t =>
    buildRowReport(t.id, t.nameAr, t.nameEn, "orderFlow", ORDER_FLOW_VOTERS, candles)
  );

  // Fundamental: use live votes from /api/fundamental if available.
  // No MACD fallback — absent data → neutral (0). Weight gets redistributed in confluence.ts.
  const fundamentalRows = ECON_INDICATORS.slice(0, 20).map(t => {
    const perTf: Record<Timeframe, -1|0|1> = {} as any;
    for (const tf of TIMEFRAMES) {
      const v = fundamentalVotes?.[tf] ?? 0;
      perTf[tf] = (v > 0.05 ? 1 : v < -0.05 ? -1 : 0) as -1|0|1;
    }
    const decision = buildRowDecision(perTf, "indicators");
    return { id: t.id, nameAr: t.nameAr, nameEn: t.nameEn, decision };
  });

  const coreT      = tableSummary(coreRows);
  const schoolsT   = tableSummary(schoolRows);
  const indT       = tableSummary(indicatorRows);
  const ofT        = tableSummary(orderFlowRows);
  const fundT      = tableSummary(fundamentalRows);

  const confluence = combineTables({
    fundamental: { perTf: fundT.perTf, composite: fundT.composite, confidence: fundT.confidence },
    coreTools:   { perTf: coreT.perTf, composite: coreT.composite, confidence: coreT.confidence },
    schools:     { perTf: schoolsT.perTf, composite: schoolsT.composite, confidence: schoolsT.confidence },
    indicators:  { perTf: indT.perTf, composite: indT.composite, confidence: indT.confidence },
    orderFlow:   { perTf: ofT.perTf, composite: ofT.composite, confidence: ofT.confidence },
  });

  return {
    tables: { coreTools: coreT, schools: schoolsT, indicators: indT, orderFlow: ofT, fundamental: fundT },
    confluence,
    source: "live",
  };
}

export function syntheticCandles(seed = 42, n = 200, basePrice = 2000): OHLCV[] {
  let p = basePrice; let s = seed;
  const out: OHLCV[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = (s / 233280 - 0.5);
    const o = p; const c = p * (1 + r * 0.004);
    const h = Math.max(o, c) * (1 + Math.abs(r) * 0.002);
    const l = Math.min(o, c) * (1 - Math.abs(r) * 0.002);
    const v = 1000 + Math.abs(r) * 5000;
    out.push({ t: Date.now() - (n - i) * 60000, o, h, l, c, v });
    p = c;
  }
  return out;
}

export function syntheticCandlesAllTf(base = 2000): CandlesByTf {
  const c: CandlesByTf = {} as any;
  let s = 11;
  for (const tf of TIMEFRAMES) { c[tf] = syntheticCandles(s, 200, base); s += 7; }
  return c;
}
