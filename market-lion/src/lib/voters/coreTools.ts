// Per-ID voter functions for Table 3 — 23 core tools
import type { OHLCV } from "../types";
import * as I from "../indicators";

type Voter = (c: OHLCV[]) => -1|0|1;
const sign = (x: number): -1|0|1 => x > 0 ? 1 : x < 0 ? -1 : 0;

export const CORE_VOTERS: Record<number, Voter> = {
  // 1 — Market Structure HH/HL/LH/LL
  1: c => I.marketStructure(c),
  // 2 — Pivot Points
  2: c => {
    const last = c[c.length-1]; const prev = c[c.length-2];
    if (!prev) return 0;
    const pivot = (prev.h + prev.l + prev.c) / 3;
    if (last.c > pivot + (pivot - prev.l)) return 1;   // above R1
    if (last.c < pivot - (prev.h - pivot)) return -1;  // below S1
    return last.c > pivot ? 1 : last.c < pivot ? -1 : 0;
  },
  // 3 — Candlestick patterns
  3: c => I.candlePatterns(c),
  // 4 — Major Support & Resistance
  4: c => {
    const n = Math.min(100, c.length);
    const slice = c.slice(-n);
    const hh = Math.max(...slice.map(x=>x.h));
    const ll = Math.min(...slice.map(x=>x.l));
    const last = c[c.length-1].c;
    const midR = (hh + last) / 2;
    const midS = (ll + last) / 2;
    if (last > midR) return 1;
    if (last < midS) return -1;
    return 0;
  },
  // 5 — Minor Support & Resistance (closer lookback)
  5: c => {
    const n = Math.min(20, c.length);
    const slice = c.slice(-n);
    const hh = Math.max(...slice.map(x=>x.h));
    const ll = Math.min(...slice.map(x=>x.l));
    const last = c[c.length-1].c;
    const range = hh - ll;
    if (range < 1e-9) return 0;
    const pos = (last - ll) / range;
    if (pos > 0.7) return 1; if (pos < 0.3) return -1; return 0;
  },
  // 6 — Trend Lines
  6: c => {
    const lr = I.linearRegression(c.map(x=>x.c), Math.min(40, c.length));
    return sign(lr.slope.at(-1) || 0);
  },
  // 7 — SMA 200
  7: c => {
    if (c.length < 200) return 0;
    const sm = I.sma(c.map(x=>x.c), 200);
    const last = c[c.length-1].c; const ma = sm.at(-1)!;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 8 — SMA 60
  8: c => {
    if (c.length < 60) return 0;
    const sm = I.sma(c.map(x=>x.c), 60);
    const last = c[c.length-1].c; const ma = sm.at(-1)!;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 9 — EMA 7 & 21 crossover
  9: c => {
    const cls = c.map(x=>x.c);
    const f = I.ema(cls, 7); const s = I.ema(cls, 21);
    const a = f.at(-1)!, b = s.at(-1)!;
    if (!isFinite(a) || !isFinite(b)) return 0;
    return a > b ? 1 : a < b ? -1 : 0;
  },
  // 10 — FRAMA (approximate via adaptive EMA)
  10: c => {
    const cls = c.map(x=>x.c);
    const k = I.kama(cls, 10);
    const last = cls.at(-1)!; const ma = k.at(-1)!;
    if (!isFinite(ma)) return 0;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 11 — Standard Deviation Channel
  11: c => {
    const cls = c.map(x=>x.c);
    const bb = I.bollinger(cls, 20, 2);
    const last = cls.at(-1)!; const b = bb.at(-1)!;
    if (!isFinite(b.upper)) return 0;
    if (last > b.upper) return 1;
    if (last < b.lower) return -1;
    const bp = I.bollingerPercentB(cls).at(-1)!;
    return bp > 50 ? 1 : bp < 50 ? -1 : 0;
  },
  // 12 — Linear Regression Channel
  12: c => {
    const lr = I.linearRegression(c.map(x=>x.c), Math.min(30, c.length));
    const slope = lr.slope.at(-1) || 0;
    const val = lr.value.at(-1) || 0;
    const last = c[c.length-1].c;
    return last > val && slope > 0 ? 1 : last < val && slope < 0 ? -1 : sign(slope);
  },
  // 13 — Classical Chart Patterns
  13: c => {
    // H&S / double top/bottom approximation via pivot
    if (c.length < 30) return 0;
    const slice = c.slice(-30);
    const mid = slice.slice(10, 20);
    const start = slice.slice(0, 10);
    const end = slice.slice(20);
    const midHigh = Math.max(...mid.map(x=>x.h));
    const startHigh = Math.max(...start.map(x=>x.h));
    const endHigh = Math.max(...end.map(x=>x.h));
    const midLow = Math.min(...mid.map(x=>x.l));
    const startLow = Math.min(...start.map(x=>x.l));
    const endLow = Math.min(...end.map(x=>x.l));
    // Double bottom: mid lower than start/end
    if (midLow < startLow && midLow < endLow && c[c.length-1].c > midHigh) return 1;
    // Double top
    if (midHigh > startHigh && midHigh > endHigh && c[c.length-1].c < midLow) return -1;
    return I.candlePatterns(c);
  },
  // 14 — SMC / ICT
  14: c => {
    const ls = I.liquiditySweep(c);
    const ob = I.orderBlockVote(c);
    const ms = I.marketStructure(c);
    const signals = [ls, ob, ms].filter(x=>x!==0);
    if (!signals.length) return 0;
    const sum = signals.reduce((a,b)=>a+b,0);
    return sum > 0 ? 1 : sum < 0 ? -1 : 0;
  },
  // 15 — ICT Full Methodology (killzones + OTE + liquidity)
  15: c => {
    const ls = I.liquiditySweep(c);
    const ms = I.ipdaVote(c);
    const fib = I.fibonacciRetracement(c);
    const session = I.marketSessionVote(c);
    const signals = [ls, ms, fib, session].filter(x=>x!==0);
    if (!signals.length) return 0;
    const sum = signals.reduce((a,b)=>a+b,0);
    return sum >= 2 ? 1 : sum <= -2 ? -1 : 0;
  },
  // 16 — Supply & Demand Zones
  16: c => I.supplyDemandZone(c),
  // 17 — Order Blocks with $ Volume
  17: c => {
    const ob = I.orderBlockVote(c);
    const vsaV = I.vsaVote(c);
    if (ob !== 0) return ob;
    return vsaV;
  },
  // 18 — Raw Volume
  18: c => {
    const vv = c.map(x=>x.v);
    const avg = vv.slice(-20).reduce((a,b)=>a+b,0)/20;
    const last = vv.at(-1)!;
    const dir = c[c.length-1].c > c[c.length-1].o ? 1 : -1;
    return last > avg * 1.2 ? dir : 0;
  },
  // 19 — Order Flow (cumulative delta approximation)
  19: c => I.orderFlowApprox(c),
  // 20 — Liquidity & Stop hunts
  20: c => I.liquiditySweep(c),
  // 21 — Fibonacci Retracement
  21: c => I.fibonacciRetracement(c),
  // 22 — Fibonacci Extension
  22: c => {
    const fib = I.fibonacciRetracement(c);
    const ms = I.marketStructure(c);
    return fib !== 0 ? fib : ms;
  },
  // 23 — RSI + Divergence
  23: c => {
    const cls = c.map(x=>x.c);
    const r = I.rsi(cls, 14);
    const last = r.at(-1)!;
    if (!isFinite(last)) return 0;
    // Divergence: price makes new high but RSI doesn't
    const recentPrice = cls.slice(-5);
    const recentRSI   = r.slice(-5);
    const priceTrend = sign(recentPrice[recentPrice.length-1] - recentPrice[0]);
    const rsiTrend   = sign(recentRSI[recentRSI.length-1] - recentRSI[0]);
    if (priceTrend !== rsiTrend && priceTrend !== 0 && rsiTrend !== 0) {
      return rsiTrend; // hidden divergence → follow RSI
    }
    if (last > 70) return -1; if (last < 30) return 1;
    return last > 50 ? 1 : -1;
  },
};
