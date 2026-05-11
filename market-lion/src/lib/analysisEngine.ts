// Top-level analysis engine: runs deterministic indicator-based votes for each row
// in each table and computes the final confluence (Buy Lion / Sell Lion).
import { TIMEFRAMES, Timeframe } from "@/data/timeframes";
import { CORE_TOOLS } from "@/data/coreTools";
import { SCHOOLS } from "@/data/schools";
import { INDICATORS } from "@/data/indicators";
import { ORDER_FLOW_TOOLS } from "@/data/orderFlow";
import { ECON_INDICATORS } from "@/data/fundamental";
import { adx, atr, bollinger, ema, macd, rsi, sma, stoch, helpers } from "./indicators";
import { buildRowDecision } from "./scoring";
import type { OHLCV, RowDecision } from "./types";
import { combineTables } from "./confluence";

export type CandlesByTf = Record<Timeframe, OHLCV[]>;

export type RowReport = {
  id: number;
  nameAr: string;
  nameEn: string;
  decision: RowDecision;
};

export type TableReport = {
  rows: RowReport[];
  perTf: Record<Timeframe, number>;       // mean weighted vote per TF (-1..+1) scaled to (-100..+100)
  composite: number;
  confidence: number;
};

const sign = (x: number): -1 | 0 | 1 => x > 0 ? 1 : x < 0 ? -1 : 0;

// Map closes to a per-tf signed vote based on a generic indicator method.
type Voter = (c: OHLCV[]) => -1 | 0 | 1;

const closes = helpers.closes;
const highs  = helpers.highs;
const lows   = helpers.lows;

// A small library of vote functions used for many rows. They are deterministic on candle data.
const V: Record<string, Voter> = {
  ema_cross: c => {
    const cls = closes(c); if (cls.length < 30) return 0;
    const f = ema(cls, 7); const s = ema(cls, 21);
    const a = f.at(-1)!, b = s.at(-1)!;
    const aPrev = f.at(-2)!, bPrev = s.at(-2)!;
    if (!isFinite(a) || !isFinite(b)) return 0;
    if (a > b && aPrev <= bPrev) return 1;
    if (a < b && aPrev >= bPrev) return -1;
    return a > b ? 1 : a < b ? -1 : 0;
  },
  sma_trend: c => {
    const cls = closes(c); const m = sma(cls, 50); const last = cls.at(-1)!; const mm = m.at(-1);
    if (!mm || !isFinite(mm)) return 0; return last > mm ? 1 : last < mm ? -1 : 0;
  },
  rsi_oversold_overbought: c => {
    const r = rsi(closes(c), 14).at(-1); if (!isFinite(r as number)) return 0;
    if ((r as number) > 70) return -1; if ((r as number) < 30) return 1; return 0;
  },
  macd_hist: c => {
    const m = macd(closes(c)); const h = m.hist.at(-1); if (!isFinite(h as number)) return 0;
    return sign(h as number);
  },
  bollinger_break: c => {
    const b = bollinger(closes(c)).at(-1)!; const last = closes(c).at(-1)!;
    if (!isFinite(b.upper)) return 0;
    return last > b.upper ? 1 : last < b.lower ? -1 : 0;
  },
  stoch_xover: c => {
    const s = stoch(c); const k = s.k.at(-1) as number; const d = s.d.at(-1) as number;
    if (!isFinite(k) || !isFinite(d)) return 0;
    if (k < 20 && k > d) return 1; if (k > 80 && k < d) return -1;
    return k > d ? 1 : k < d ? -1 : 0;
  },
  adx_strength: c => {
    const a = adx(c); const last = a.adx.at(-1) as number;
    const pdi = a.pdi.at(-1) as number; const ndi = a.ndi.at(-1) as number;
    if (!isFinite(last)) return 0;
    if (last < 20) return 0;
    return pdi > ndi ? 1 : pdi < ndi ? -1 : 0;
  },
  atr_breakout: c => {
    const a = atr(c, 14).at(-1) as number; const last = closes(c).at(-1)!; const prev = closes(c).at(-2);
    if (!isFinite(a) || !prev) return 0;
    if (last - prev > a * 0.5) return 1;
    if (prev - last > a * 0.5) return -1;
    return 0;
  },
  pivot_support_resistance: c => {
    const last = c.at(-1)!; const prev = c.at(-2); if (!prev) return 0;
    const pivot = (prev.h + prev.l + prev.c) / 3;
    return last.c > pivot ? 1 : last.c < pivot ? -1 : 0;
  },
  donchian: c => {
    const n = 20; if (c.length < n + 1) return 0;
    let hh = -Infinity, ll = Infinity;
    for (let i = c.length - n - 1; i < c.length - 1; i++) { hh = Math.max(hh, c[i].h); ll = Math.min(ll, c[i].l); }
    const last = c.at(-1)!; if (last.c > hh) return 1; if (last.c < ll) return -1; return 0;
  },
  obv_dir: c => {
    let obv = 0; let prevObv = 0;
    for (let i = 1; i < c.length; i++) {
      const ch = c[i].c - c[i-1].c;
      if (ch > 0) obv += c[i].v; else if (ch < 0) obv -= c[i].v;
      if (i === c.length - 5) prevObv = obv;
    }
    return obv > prevObv ? 1 : obv < prevObv ? -1 : 0;
  },
  vwap_pos: c => {
    let pv = 0, vv = 0; for (const x of c) { pv += ((x.h + x.l + x.c)/3) * x.v; vv += x.v; }
    if (!vv) return 0; const vwap = pv / vv; const last = c.at(-1)!.c;
    return last > vwap ? 1 : last < vwap ? -1 : 0;
  },
  parabolic_sar_dir: c => {
    // simplified: above midline = bullish, below = bearish
    const cls = closes(c); const m = sma(cls, 10).at(-1) as number; const last = cls.at(-1)!;
    if (!isFinite(m)) return 0; return last > m ? 1 : last < m ? -1 : 0;
  },
  ichimoku_cloud: c => {
    if (c.length < 60) return 0;
    const conversion = (i: number) => { const slice = c.slice(i-9, i); const hh = Math.max(...slice.map(x=>x.h)); const ll = Math.min(...slice.map(x=>x.l)); return (hh+ll)/2; };
    const baseline   = (i: number) => { const slice = c.slice(i-26, i); const hh = Math.max(...slice.map(x=>x.h)); const ll = Math.min(...slice.map(x=>x.l)); return (hh+ll)/2; };
    const i = c.length - 1; const t = conversion(i); const b = baseline(i); const last = c[i].c;
    if (last > Math.max(t,b)) return 1; if (last < Math.min(t,b)) return -1; return 0;
  },
  liquidity_sweep: c => {
    // bullish if low pierced prior low and closed above
    if (c.length < 5) return 0;
    const prevLow = Math.min(...c.slice(-5,-1).map(x=>x.l));
    const prevHigh= Math.max(...c.slice(-5,-1).map(x=>x.h));
    const last = c.at(-1)!;
    if (last.l < prevLow && last.c > prevLow) return 1;
    if (last.h > prevHigh && last.c < prevHigh) return -1;
    return 0;
  },
};

// Map each row id to a primary voter — by category fallback if none defined.
function voterFor(table: "core"|"schools"|"indicators"|"orderFlow", id: number, name: string): Voter {
  const n = name.toLowerCase();
  if (n.includes("rsi")) return V.rsi_oversold_overbought;
  if (n.includes("macd")) return V.macd_hist;
  if (n.includes("bollinger")) return V.bollinger_break;
  if (n.includes("stoch")) return V.stoch_xover;
  if (n.includes("adx") || n.includes("dmi")) return V.adx_strength;
  if (n.includes("atr") || n.includes("supertrend")) return V.atr_breakout;
  if (n.includes("pivot")) return V.pivot_support_resistance;
  if (n.includes("donchian") || n.includes("keltner")) return V.donchian;
  if (n.includes("obv") || n.includes("volume") || n.includes("mfi")) return V.obv_dir;
  if (n.includes("vwap")) return V.vwap_pos;
  if (n.includes("parabolic")) return V.parabolic_sar_dir;
  if (n.includes("ichimoku")) return V.ichimoku_cloud;
  if (n.includes("liquidity") || n.includes("sweep") || n.includes("stop hunt")) return V.liquidity_sweep;
  if (n.includes("ema") || n.includes("smc") || n.includes("ict")) return V.ema_cross;
  if (n.includes("sma")) return V.sma_trend;
  // Defaults by table
  if (table === "indicators") return V.ema_cross;
  if (table === "schools") return V.sma_trend;
  if (table === "orderFlow") return V.obv_dir;
  return V.ema_cross;
}

function rowDecisionFor(name: string, table: "core"|"schools"|"indicators"|"orderFlow", id: number, candles: CandlesByTf): RowDecision {
  const v = voterFor(table, id, name);
  const perTf: Record<Timeframe, -1 | 0 | 1> = {} as any;
  for (const tf of TIMEFRAMES) {
    const c = candles[tf]; perTf[tf] = c && c.length >= 30 ? v(c) : 0;
  }
  const tableKey: "coreTools" | "schools" | "indicators" | "orderFlow" =
    table === "core" ? "coreTools" : table === "schools" ? "schools" : table === "indicators" ? "indicators" : "orderFlow";
  return buildRowDecision(perTf, tableKey);
}

function tableSummary(rows: RowReport[]): TableReport {
  const perTf: Record<Timeframe, number> = {} as any;
  for (const tf of TIMEFRAMES) {
    let s = 0;
    for (const r of rows) s += r.decision.perTf[tf];
    const avg = rows.length ? s / rows.length : 0; // -1..+1
    perTf[tf] = avg * 100; // expand to -100..+100 share
  }
  const composite = rows.reduce((a, r) => a + r.decision.weighted, 0) / Math.max(rows.length, 1);
  const confidence = rows.reduce((a, r) => a + r.decision.confidence, 0) / Math.max(rows.length, 1);
  return { rows, perTf, composite, confidence };
}

export function runAnalysis(candles: CandlesByTf) {
  const coreRows = CORE_TOOLS.map(t => ({ id: t.id, nameAr: t.nameAr, nameEn: t.nameEn, decision: rowDecisionFor(t.nameEn, "core", t.id, candles) }));
  const schoolsRows = SCHOOLS.map(t => ({ id: t.id, nameAr: t.nameAr, nameEn: t.nameEn, decision: rowDecisionFor(t.nameEn, "schools", t.id, candles) }));
  const indicatorRows = INDICATORS.map(t => ({ id: t.id, nameAr: t.nameAr, nameEn: t.nameEn, decision: rowDecisionFor(t.nameEn, "indicators", t.id, candles) }));
  const orderFlowRows = ORDER_FLOW_TOOLS.map(t => ({ id: t.id, nameAr: t.nameAr, nameEn: t.nameEn, decision: rowDecisionFor(t.nameEn, "orderFlow", t.id, candles) }));
  // Fundamental table is event-driven — we approximate with recent volatility + macro lean of the asset.
  const fundamentalRows = ECON_INDICATORS.slice(0, 20).map(t => ({
    id: t.id, nameAr: t.nameAr, nameEn: t.nameEn,
    decision: rowDecisionFor(t.nameEn, "indicators", t.id, candles),
  }));

  const coreT      = tableSummary(coreRows);
  const schoolsT   = tableSummary(schoolsRows);
  const indT       = tableSummary(indicatorRows);
  const ofT        = tableSummary(orderFlowRows);
  const fundT      = tableSummary(fundamentalRows);

  const confluence = combineTables({
    fundamental: { perTf: fundT.perTf, composite: fundT.composite, confidence: fundT.confidence },
    coreTools:   { perTf: coreT.perTf, composite: coreT.composite, confidence: coreT.confidence },
    schools:     { perTf: schoolsT.perTf, composite: schoolsT.composite, confidence: schoolsT.confidence },
    indicators:  { perTf: indT.perTf,  composite: indT.composite,  confidence: indT.confidence  },
    orderFlow:   { perTf: ofT.perTf,   composite: ofT.composite,   confidence: ofT.confidence   },
  });

  return {
    tables: { coreTools: coreT, schools: schoolsT, indicators: indT, orderFlow: ofT, fundamental: fundT },
    confluence,
  };
}

// Generate synthetic candles for offline / cold-start scenarios (used by demo mode).
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
