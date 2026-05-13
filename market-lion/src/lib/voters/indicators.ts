// Per-ID voter functions for Table 5 — 54 technical indicators
import type { OHLCV } from "../types";
import * as I from "../indicators";

type Voter = (c: OHLCV[]) => -1|0|1;
const sign = (x: number): -1|0|1 => x > 0 ? 1 : x < 0 ? -1 : 0;
const cls = (c: OHLCV[]) => c.map(x => x.c);

export const INDICATOR_VOTERS: Record<number, Voter> = {
  // ── Trend (11) ──────────────────────────────────────────────────────
  // 1 — Parabolic SAR
  1: c => {
    const { bull } = I.parabolicSAR(c);
    return bull.at(-1) ? 1 : -1;
  },
  // 2 — Supertrend
  2: c => {
    const { dir } = I.supertrend(c, 10, 3);
    return dir.at(-1) || 0;
  },
  // 3 — WMA
  3: c => {
    const prices = cls(c);
    const wm = I.wma(prices, 21);
    const last = prices.at(-1)!; const ma = wm.at(-1)!;
    if (!isFinite(ma)) return 0;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 4 — HMA
  4: c => {
    const prices = cls(c);
    const hm = I.hma(prices, 21);
    const last = prices.at(-1)!; const ma = hm.at(-1)!;
    if (!isFinite(ma)) return 0;
    const prev = hm.at(-2)!;
    return ma > prev ? 1 : ma < prev ? -1 : last > ma ? 1 : -1;
  },
  // 5 — VWMA
  5: c => {
    const vm = I.vwma(c, 20);
    const last = c[c.length-1].c; const ma = vm.at(-1)!;
    if (!isFinite(ma)) return 0;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 6 — DEMA
  6: c => {
    const dm = I.dema(cls(c), 21);
    const last = cls(c).at(-1)!; const ma = dm.at(-1)!;
    if (!isFinite(ma)) return 0;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 7 — TEMA
  7: c => {
    const tm = I.tema(cls(c), 21);
    const last = cls(c).at(-1)!; const ma = tm.at(-1)!;
    if (!isFinite(ma)) return 0;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 8 — KAMA
  8: c => {
    const km = I.kama(cls(c), 10);
    const last = cls(c).at(-1)!; const ma = km.at(-1)!;
    if (!isFinite(ma)) return 0;
    const prev = km.at(-3)!;
    return ma > prev ? (last > ma ? 1 : 0) : ma < prev ? (last < ma ? -1 : 0) : 0;
  },
  // 9 — ALMA
  9: c => {
    const am = I.alma(cls(c), 9);
    const last = cls(c).at(-1)!; const ma = am.at(-1)!;
    if (!isFinite(ma)) return 0;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 10 — McGinley Dynamic
  10: c => {
    const mg = I.mcginley(cls(c), 14);
    const last = cls(c).at(-1)!; const ma = mg.at(-1)!;
    if (!isFinite(ma)) return 0;
    return last > ma ? 1 : last < ma ? -1 : 0;
  },
  // 11 — Volatility Stop
  11: c => {
    const st = I.supertrend(c, 10, 2);
    return st.dir.at(-1) || 0;
  },

  // ── Momentum (15) ───────────────────────────────────────────────────
  // 12 — MACD
  12: c => sign(I.macd(cls(c)).hist.at(-1) || 0),
  // 13 — Stochastic Oscillator
  13: c => {
    const s = I.stoch(c); const k = s.k.at(-1)!; const d = s.d.at(-1)!;
    if (!isFinite(k) || !isFinite(d)) return 0;
    if (k < 20 && k > d) return 1; if (k > 80 && k < d) return -1;
    return k > d ? 1 : k < d ? -1 : 0;
  },
  // 14 — Stochastic RSI
  14: c => {
    const sr = I.stochRSI(cls(c));
    const k = sr.k.at(-1)!;
    if (!isFinite(k)) return 0;
    if (k < 20) return 1; if (k > 80) return -1;
    return k > 50 ? 1 : -1;
  },
  // 15 — ADX + DMI
  15: c => {
    const a = I.adx(c);
    const adxV = a.adx.at(-1)!; const pdi = a.pdi.at(-1)!; const ndi = a.ndi.at(-1)!;
    if (!isFinite(adxV)) return 0;
    if (adxV < 20) return 0;
    return pdi > ndi ? 1 : pdi < ndi ? -1 : 0;
  },
  // 16 — CCI
  16: c => {
    const cv = I.cci(c, 20).at(-1)!;
    if (!isFinite(cv)) return 0;
    if (cv > 100) return 1; if (cv < -100) return -1;
    return cv > 0 ? 1 : -1;
  },
  // 17 — Williams %R
  17: c => {
    const wr = I.williamsR(c, 14).at(-1)!;
    if (!isFinite(wr)) return 0;
    if (wr < -80) return 1; if (wr > -20) return -1;
    return wr > -50 ? 1 : -1;
  },
  // 18 — ROC
  18: c => sign(I.roc(cls(c), 12).at(-1) || 0),
  // 19 — Momentum
  19: c => sign(I.momentum(cls(c), 10).at(-1) || 0),
  // 20 — Awesome Oscillator
  20: c => {
    const ao = I.awesomeOscillator(c);
    const last = ao.at(-1)!; const prev = ao.at(-2)!;
    if (!isFinite(last)) return 0;
    if (last > 0 && last > prev) return 1;
    if (last < 0 && last < prev) return -1;
    return last > 0 ? 1 : last < 0 ? -1 : 0;
  },
  // 21 — Ultimate Oscillator
  21: c => {
    const uo = I.ultimateOscillator(c).at(-1)!;
    if (!isFinite(uo)) return 0;
    if (uo > 70) return 1; if (uo < 30) return -1;
    return uo > 50 ? 1 : -1;
  },
  // 22 — TRIX
  22: c => {
    const tx = I.trix(cls(c), 14);
    const last = tx.at(-1)!; const prev = tx.at(-2)!;
    if (!isFinite(last)) return 0;
    if (last > 0 && last > prev) return 1;
    if (last < 0 && last < prev) return -1;
    return sign(last);
  },
  // 23 — Aroon
  23: c => {
    const ar = I.aroon(c, 25);
    const up = ar.up.at(-1)!; const dn = ar.down.at(-1)!;
    if (!isFinite(up)) return 0;
    return up > dn ? 1 : up < dn ? -1 : 0;
  },
  // 24 — Vortex Indicator
  24: c => {
    const vo = I.vortex(c, 14);
    const vip = vo.vip.at(-1)!; const vin = vo.vin.at(-1)!;
    if (!isFinite(vip)) return 0;
    return vip > vin ? 1 : vip < vin ? -1 : 0;
  },
  // 25 — Coppock Curve
  25: c => {
    const co = I.coppock(cls(c));
    const last = co.at(-1)!; const prev = co.at(-2)!;
    if (!isFinite(last)) return 0;
    if (last < 0 && last > prev) return 1;  // cross up from negative = buy
    if (last > 0 && last < prev) return -1;
    return sign(last);
  },
  // 26 — Chande Momentum Oscillator
  26: c => {
    const cm = I.cmo(cls(c), 14).at(-1)!;
    if (!isFinite(cm)) return 0;
    if (cm > 50) return 1; if (cm < -50) return -1;
    return cm > 0 ? 1 : -1;
  },

  // ── Volatility (9) ──────────────────────────────────────────────────
  // 27 — Bollinger Bands
  27: c => {
    const bb = I.bollinger(cls(c), 20, 2).at(-1)!;
    const last = cls(c).at(-1)!;
    if (!isFinite(bb.upper)) return 0;
    if (last > bb.upper) return 1; if (last < bb.lower) return -1;
    const bp = I.bollingerPercentB(cls(c)).at(-1)!;
    return bp > 50 ? 1 : -1;
  },
  // 28 — ATR (breakout direction)
  28: c => {
    const a = I.atr(c, 14).at(-1)!;
    const prices = cls(c);
    const last = prices.at(-1)!; const prev = prices.at(-2)!;
    if (!isFinite(a) || !prev) return 0;
    if (last - prev > a * 0.5) return 1;
    if (prev - last > a * 0.5) return -1;
    return 0;
  },
  // 29 — Keltner Channels
  29: c => {
    const kc = I.keltnerChannels(c, 20, 2).at(-1)!;
    const last = cls(c).at(-1)!;
    if (!isFinite(kc.upper)) return 0;
    if (last > kc.upper) return 1; if (last < kc.lower) return -1;
    return last > kc.mid ? 1 : -1;
  },
  // 30 — Donchian Channels
  30: c => {
    const dc = I.donchian(c, 20).at(-1)!;
    const last = cls(c).at(-1)!;
    if (!isFinite(dc.upper)) return 0;
    if (last >= dc.upper) return 1; if (last <= dc.lower) return -1;
    return last > dc.mid ? 1 : -1;
  },
  // 31 — Historical Volatility
  31: c => {
    const hv = I.historicalVolatility(cls(c), 20);
    const last = hv.at(-1)!; const avg = I.sma(hv.filter(isFinite), 10).at(-1)!;
    if (!isFinite(last) || !isFinite(avg)) return 0;
    const trend = I.ema(cls(c), 21).at(-1)! > I.ema(cls(c), 55).at(-1)! ? 1 : -1;
    return last < avg ? trend : 0; // low vol + trend = continuation
  },
  // 32 — Choppiness Index
  32: c => {
    const ci = I.choppiness(c, 14).at(-1)!;
    if (!isFinite(ci)) return 0;
    if (ci < 38.2) return I.marketStructure(c); // trending
    if (ci > 61.8) return 0; // choppy
    return 0;
  },
  // 33 — Chaikin Volatility (approximate via ATR ratio)
  33: c => {
    if (c.length < 20) return 0;
    const atrVals = I.atr(c, 10);
    const atrNow = atrVals.at(-1)!;
    const atrPrev = atrVals.at(-11)!;
    if (!isFinite(atrNow) || !isFinite(atrPrev)) return 0;
    const cv = (atrNow - atrPrev) / Math.max(atrPrev, 1e-9);
    return cv > 0.1 ? 1 : cv < -0.1 ? -1 : 0;
  },
  // 34 — Mass Index
  34: c => {
    const mi = I.massIndex(c, 9, 25).at(-1)!;
    if (!isFinite(mi)) return 0;
    // Reversal bulge: MI > 27 then drops below 26.5
    const miPrev = I.massIndex(c, 9, 25).at(-2)!;
    if (isFinite(miPrev) && miPrev > 27 && mi < 26.5) {
      return I.ema(cls(c), 9).at(-1)! > I.ema(cls(c), 21).at(-1)! ? -1 : 1;
    }
    return 0;
  },
  // 35 — Volatility Index VIX-style (use HV as proxy)
  35: c => {
    const hv = I.historicalVolatility(cls(c), 21).at(-1)!;
    const hvAvg = I.sma(I.historicalVolatility(cls(c), 21).filter(isFinite), 60).at(-1)!;
    if (!isFinite(hv) || !isFinite(hvAvg)) return 0;
    // Fear spike: HV > 1.5× average → caution (bearish momentum)
    return hv > hvAvg * 1.5 ? -1 : hv < hvAvg * 0.7 ? 1 : 0;
  },

  // ── Volume (11) ─────────────────────────────────────────────────────
  // 36 — OBV
  36: c => {
    const o = I.obv(c);
    const ema = I.ema(o, 20);
    return o.at(-1)! > ema.at(-1)! ? 1 : -1;
  },
  // 37 — MFI
  37: c => {
    const m = I.mfi(c, 14).at(-1)!;
    if (!isFinite(m)) return 0;
    if (m > 80) return -1; if (m < 20) return 1;
    return m > 50 ? 1 : -1;
  },
  // 38 — Accumulation/Distribution
  38: c => {
    const ad = I.adLine(c);
    const ema = I.ema(ad, 20);
    return ad.at(-1)! > ema.at(-1)! ? 1 : -1;
  },
  // 39 — Chaikin Money Flow
  39: c => {
    const cf = I.cmf(c, 21).at(-1)!;
    if (!isFinite(cf)) return 0;
    return cf > 0.25 ? 1 : cf < -0.25 ? -1 : cf > 0 ? 1 : -1;
  },
  // 40 — Chaikin Oscillator
  40: c => sign(I.chaikinOscillator(c).at(-1) || 0),
  // 41 — Klinger Oscillator
  41: c => {
    const ko = I.klingerOscillator(c);
    const last = ko.at(-1)!; const prev = ko.at(-2)!;
    if (!isFinite(last)) return 0;
    if (last > 0 && last > prev) return 1;
    if (last < 0 && last < prev) return -1;
    return sign(last);
  },
  // 42 — Force Index
  42: c => {
    const fi = I.forceIndex(c, 13).at(-1)!;
    if (!isFinite(fi)) return 0;
    return fi > 0 ? 1 : fi < 0 ? -1 : 0;
  },
  // 43 — Ease of Movement
  43: c => {
    const eom = I.easeOfMovement(c, 14).at(-1)!;
    if (!isFinite(eom)) return 0;
    return eom > 0 ? 1 : eom < 0 ? -1 : 0;
  },
  // 44 — Volume Oscillator
  44: c => sign(I.volumeOscillator(c, 5, 10).at(-1) || 0),
  // 45 — PVI
  45: c => {
    const p = I.pvi(c);
    const pEma = I.ema(p, 255);
    return p.at(-1)! > pEma.at(-1)! ? 1 : -1;
  },
  // 46 — NVI
  46: c => {
    const n = I.nvi(c);
    const nEma = I.ema(n, 255);
    return n.at(-1)! > nEma.at(-1)! ? 1 : -1;
  },

  // ── Smart Money (3) ─────────────────────────────────────────────────
  // 47 — VWAP
  47: c => {
    const vw = I.vwap(c);
    const last = cls(c).at(-1)!; const vwap = vw.at(-1)!;
    return last > vwap ? 1 : last < vwap ? -1 : 0;
  },
  // 48 — Anchored VWAP (anchor from session start ≈ last 96 candles)
  48: c => {
    const n = Math.min(96, c.length);
    const session = c.slice(-n);
    const vw = I.vwap(session);
    const last = session[session.length-1].c; const vwap = vw.at(-1)!;
    return last > vwap ? 1 : last < vwap ? -1 : 0;
  },
  // 49 — VWAP with StdDev Bands
  49: c => {
    const vwb = I.vwapWithBands(c, 2);
    const last = cls(c).at(-1)!;
    if (!isFinite(vwb.upper.at(-1)!)) return 0;
    if (last > vwb.upper.at(-1)!) return 1;
    if (last < vwb.lower.at(-1)!) return -1;
    return last > vwb.vwap.at(-1)! ? 1 : -1;
  },

  // ── Composite (5) ───────────────────────────────────────────────────
  // 50 — Ichimoku Kinko Hyo (full 5-line)
  50: c => {
    if (c.length < 60) return 0;
    const ich = I.ichimoku(c);
    const last = cls(c).at(-1)!;
    const tenkan = ich.tenkan.at(-1)!;
    const kijun  = ich.kijun.at(-1)!;
    const senkouA = ich.senkouA.at(-26)!;
    const senkouB = ich.senkouB.at(-26)!;
    if (!isFinite(tenkan)) return 0;
    const cloudTop = Math.max(senkouA, senkouB);
    const cloudBot = Math.min(senkouA, senkouB);
    let score = 0;
    if (last > cloudTop) score += 2;
    else if (last < cloudBot) score -= 2;
    if (tenkan > kijun) score += 1;
    else if (tenkan < kijun) score -= 1;
    if (isFinite(ich.chikou.at(-1)!) && ich.chikou.at(-1)! > last) score += 1;
    return score >= 2 ? 1 : score <= -2 ? -1 : 0;
  },
  // 51 — Bollinger %B + Bandwidth
  51: c => {
    const bp = I.bollingerPercentB(cls(c), 20, 2).at(-1)!;
    if (!isFinite(bp)) return 0;
    const bb = I.bollinger(cls(c), 20, 2);
    const lastBB = bb.at(-1)!;
    const bw = (lastBB.upper - lastBB.lower) / Math.max(lastBB.mid, 1e-9) * 100;
    const bwAvg = I.sma(bb.map(b=>isFinite(b.upper)?(b.upper-b.lower)/Math.max(b.mid,1e-9)*100:NaN).filter(isFinite), 20).at(-1)!;
    // Squeeze + breakout: low bandwidth then %B crosses 50
    if (bw < bwAvg * 0.8 && bp > 50) return 1;
    if (bw < bwAvg * 0.8 && bp < 50) return -1;
    return bp > 50 ? 1 : -1;
  },
  // 52 — McClellan Oscillator (approximate via A/D line oscillator)
  52: c => {
    const ad = I.adLine(c);
    const fast = I.ema(ad, 19);
    const slow  = I.ema(ad, 39);
    const mcl = fast.map((v,i) => isFinite(v) && isFinite(slow[i]) ? v - slow[i] : NaN);
    const last = mcl.at(-1)!;
    if (!isFinite(last)) return 0;
    return last > 0 ? 1 : -1;
  },
  // 53 — TRIN / Arms Index (approximate via volume/advance ratio)
  53: c => {
    // Approximate: TRIN > 1 = bearish, < 1 = bullish
    const vv = c.map(x=>x.v);
    const upVol = c.filter(x=>x.c>x.o).reduce((a,x)=>a+x.v, 0);
    const dnVol = c.filter(x=>x.c<x.o).reduce((a,x)=>a+x.v, 0);
    const upIss = c.filter(x=>x.c>x.o).length;
    const dnIss = c.filter(x=>x.c<x.o).length;
    if (!upIss || !dnIss || !upVol || !dnVol) return 0;
    const trin = (upIss / dnIss) / (upVol / dnVol);
    return trin < 0.8 ? 1 : trin > 1.2 ? -1 : 0;
  },
  // 54 — Advance/Decline Line
  54: c => {
    const ad = I.adLine(c);
    const slope = I.linearRegression(ad, Math.min(20, ad.length));
    return slope.slope.at(-1)! > 0 ? 1 : -1;
  },
};
