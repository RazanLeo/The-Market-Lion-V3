// Per-ID voter functions for Table 4 — 48 schools
import type { OHLCV } from "../types";
import * as I from "../indicators";

type Voter = (c: OHLCV[]) => -1|0|1;
const sign = (x: number): -1|0|1 => x > 0 ? 1 : x < 0 ? -1 : 0;

export const SCHOOL_VOTERS: Record<number, Voter> = {
  // 1 — Dow Theory
  1: c => I.dowTheory(c),
  // 2 — IPDA
  2: c => I.ipdaVote(c),
  // 3 — Andrews Pitchfork
  3: c => I.andrewsPitchfork(c),
  // 4 — Darvas Box
  4: c => I.darvasBox(c),
  // 5 — Weinstein Stage Analysis
  5: c => I.weinsteinStage(c),
  // 6 — Bill Williams Fractal & Chaos
  6: c => {
    const ao = I.awesomeOscillator(c).at(-1) || 0;
    const frac = I.candlePatterns(c);
    if (!isFinite(ao)) return frac;
    return ao > 0 ? 1 : ao < 0 ? -1 : frac;
  },
  // 7 — Turtle Trading
  7: c => I.turtleBreakout(c),
  // 8 — Elliott Wave
  8: c => I.elliottWaveDir(c),
  // 9 — Wyckoff Method
  9: c => I.wyckoffPhase(c),
  // 10 — Hurst Cycles
  10: c => I.cyclicAnalysis(c),
  // 11 — DeMark Sequential
  11: c => I.demarkSequential(c),
  // 12 — Kondratieff Wave (very long cycle, use annual seasonality)
  12: c => I.seasonalityVote(c),
  // 13 — VSA (Volume Spread Analysis)
  13: c => I.vsaVote(c),
  // 14 — Market Profile
  14: c => I.marketProfileTPO(c),
  // 15 — Auction Market Theory
  15: c => {
    const ci = I.choppiness(c, 14).at(-1) || 50;
    if (!isFinite(ci)) return 0;
    if (ci > 61.8) return 0; // choppy = balance/range
    const ms = I.marketStructure(c);
    return ms;
  },
  // 16 — Footprint Charts & Delta
  16: c => I.orderFlowApprox(c),
  // 17 — Dark Pool Trading
  17: c => {
    // Approximate: high volume but small price movement = dark pool absorption
    const last = c[c.length-1];
    const avgVol = c.slice(-20).reduce((a,x)=>a+x.v, 0) / 20;
    const range = last.h - last.l;
    const avgRange = c.slice(-20).reduce((a,x)=>a+(x.h-x.l),0) / 20;
    if (last.v > avgVol * 1.5 && range < avgRange * 0.5) return 1; // absorption = bullish
    return I.obv(c).at(-1)! > I.ema(I.obv(c), 20).at(-1)! ? 1 : -1;
  },
  // 18 — Volume Profile VPVR
  18: c => I.volumeProfileVote(c),
  // 19 — Fibonacci Fan
  19: c => {
    const lr = I.linearRegression(c.map(x=>x.c), Math.min(30, c.length));
    return sign(lr.slope.at(-1) || 0);
  },
  // 20 — Fibonacci Arcs
  20: c => I.fibonacciRetracement(c),
  // 21 — Fibonacci Time Zones
  21: c => I.fibTimeZone(c),
  // 22 — Fibonacci Speed Resistance Fan
  22: c => I.fibonacciRetracement(c),
  // 23 — Gann Price Theory
  23: c => I.gannAngleVote(c),
  // 24 — Harmonic Patterns
  24: c => I.harmonicPattern(c),
  // 25 — Sacred Geometry / Golden Ratio
  25: c => I.sacredGeometryVote(c),
  // 26 — Renko Charts
  26: c => I.renkoBrickDir(c),
  // 27 — Heikin Ashi
  27: c => I.heikinAshiTrend(c),
  // 28 — Kagi Charts
  28: c => I.kagiDir(c),
  // 29 — Three Line Break
  29: c => I.threeLineBreak(c),
  // 30 — Range Bars
  30: c => I.rangeBarDir(c),
  // 31 — Point & Figure
  31: c => I.pointAndFigure(c),
  // 32 — Tick Charts (volume velocity)
  32: c => I.volumeChartDir(c),
  // 33 — Quantitative Algo Trading
  33: c => I.quantAlgoVote(c),
  // 34 — Mean Reversion
  34: c => I.meanReversion(c),
  // 35 — Intermarket Analysis
  35: c => I.intermarketVote(c),
  // 36 — COT Report
  36: c => I.cotVote(c),
  // 37 — Market Breadth
  37: c => I.marketBreadthVote(c),
  // 38 — AI & ML
  38: c => I.aiMlVote(c),
  // 39 — Seasonality
  39: c => I.seasonalityVote(c),
  // 40 — CANSLIM (O'Neil)
  40: c => {
    // Simplified: strong earnings proxy via price breakout on volume
    const vol = c.map(x=>x.v);
    const avgVol = vol.slice(-50).reduce((a,b)=>a+b,0)/50;
    const lastVol = vol.at(-1)!;
    const breakout = I.turtleBreakout(c);
    return breakout === 1 && lastVol > avgVol * 1.4 ? 1
         : breakout === -1 && lastVol > avgVol * 1.4 ? -1 : 0;
  },
  // 41 — Momentum Trading
  41: c => I.momentumTradingVote(c),
  // 42 — Mansfield Relative Strength
  42: c => I.mansfieldRS(c),
  // 43 — Gann Square of Time
  43: c => I.gannTimePivot(c),
  // 44 — Gann Star / Hexagon
  44: c => I.gannAngleVote(c),
  // 45 — Cyclic Analysis
  45: c => I.cyclicAnalysis(c),
  // 46 — Financial Astrology (approximate via cycle)
  46: c => I.sacredGeometryVote(c),
  // 47 — Market Sessions
  47: c => I.marketSessionVote(c),
  // 48 — Volume Charts
  48: c => I.volumeChartDir(c),
};
