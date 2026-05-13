// Per-ID voter functions for Table 6 Order Flow tools
// Note: True order flow (DOM/Footprint/Cumulative Delta) requires live Level-2 feed.
// These approximate via OHLCV volume analysis — flagged as "feed-limited".
import type { OHLCV } from "../types";
import * as I from "../indicators";

type Voter = (c: OHLCV[]) => -1|0|1;
const sign = (x: number): -1|0|1 => x > 0 ? 1 : x < 0 ? -1 : 0;

export const ORDER_FLOW_VOTERS: Record<number, Voter> = {
  // 1 — Cumulative Delta (approximate: OBV slope)
  1: c => {
    const o = I.obv(c);
    const e = I.ema(o, 14);
    const last = o.at(-1)!; const ma = e.at(-1)!;
    const slope = last - (o.at(-5) || last);
    return slope > 0 ? 1 : slope < 0 ? -1 : last > ma ? 1 : -1;
  },
  // 2 — Footprint: close position in candle body (high = buying pressure)
  2: c => {
    if (!c.length) return 0;
    const n = Math.min(5, c.length);
    let buyPressure = 0, sellPressure = 0;
    for (const x of c.slice(-n)) {
      const closeRatio = (x.c - x.l) / Math.max(x.h - x.l, 1e-9);
      buyPressure  += closeRatio * x.v;
      sellPressure += (1 - closeRatio) * x.v;
    }
    return buyPressure > sellPressure * 1.1 ? 1 : sellPressure > buyPressure * 1.1 ? -1 : 0;
  },
  // 3 — DOM Level 2: approximate via spread & volume
  3: c => {
    // Without real DOM: use MFI as best OHLCV proxy
    const mfi = I.mfi(c, 14).at(-1)!;
    if (!isFinite(mfi)) return 0;
    if (mfi > 70) return 1; if (mfi < 30) return -1;
    return mfi > 50 ? 1 : -1;
  },
  // 4 — Iceberg Orders: high vol + narrow spread candle = hidden order
  4: c => {
    const last = c[c.length-1];
    const avgVol = c.slice(-20).reduce((a,x)=>a+x.v,0) / 20;
    const avgRange = c.slice(-20).reduce((a,x)=>a+(x.h-x.l),0) / 20;
    if (last.v > avgVol * 2 && (last.h - last.l) < avgRange * 0.5) {
      return last.c > last.o ? 1 : -1; // iceberg = institutional direction
    }
    return I.orderFlowApprox(c);
  },
  // 5 — Absorption Detector: strong move absorbed at key level
  5: c => {
    const sd = I.supplyDemandZone(c);
    const ls = I.liquiditySweep(c);
    if (sd !== 0) return sd;
    return ls;
  },
  // 6 — Stop Hunt Zones
  6: c => I.liquiditySweep(c),
  // 7 — ARC Break Detection (early breakout)
  7: c => {
    const dc = I.donchian(c, 20);
    const last = c[c.length-1].c;
    const d = dc.at(-1)!;
    if (!isFinite(d.upper)) return 0;
    if (last > d.upper * 0.999) return 1;
    if (last < d.lower * 1.001) return -1;
    return I.turtleBreakout(c, 10);
  },
  // 8 — BUMP/DUMP Detector: sudden volume spike with reversal
  8: c => {
    if (c.length < 10) return 0;
    const last = c[c.length-1]; const prev = c[c.length-2];
    const avgVol = c.slice(-20).reduce((a,x)=>a+x.v,0) / 20;
    if (last.v > avgVol * 2.5) {
      // Big candle up on huge vol then small reversal = pump (short opportunity)
      if (prev.c > prev.o && last.c < last.o) return -1; // dump after pump
      if (prev.c < prev.o && last.c > last.o) return 1;  // recovery after dump
    }
    return 0;
  },
  // 9 — Liquidity Voids: fair value gaps (FVG)
  9: c => {
    if (c.length < 3) return 0;
    const [p2, p1, last] = c.slice(-3);
    // Bullish FVG: p2.h < last.l = unfilled gap below
    if (p2.h < last.l) return 1;
    // Bearish FVG: p2.l > last.h = unfilled gap above
    if (p2.l > last.h) return -1;
    return 0;
  },
  // 10 — Volume Climax: extreme volume = potential reversal
  10: c => {
    if (c.length < 20) return 0;
    const vv = c.map(x=>x.v);
    const avg = vv.slice(-20).reduce((a,b)=>a+b,0) / 20;
    const last = c[c.length-1];
    if (last.v > avg * 3) {
      // Climax: vote AGAINST the current candle direction (exhaustion)
      return last.c > last.o ? -1 : 1;
    }
    return I.obv(c).at(-1)! > I.ema(I.obv(c), 20).at(-1)! ? 1 : -1;
  },
};
