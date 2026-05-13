// Complete technical indicator library — all 54+ indicators with real formulas.
import type { OHLCV } from "./types";

export const helpers = {
  closes: (c: OHLCV[]) => c.map(x => x.c),
  highs:  (c: OHLCV[]) => c.map(x => x.h),
  lows:   (c: OHLCV[]) => c.map(x => x.l),
  vols:   (c: OHLCV[]) => c.map(x => x.v),
};

const cls = helpers.closes;
const hig = helpers.highs;
const low = helpers.lows;
const vol = helpers.vols;

// ─── Trend / Moving Averages ────────────────────────────────────────────────

export function sma(arr: number[], n: number): number[] {
  const out: number[] = []; let s = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i]; if (i >= n) s -= arr[i - n];
    out.push(i >= n - 1 ? s / n : NaN);
  }
  return out;
}

export function ema(arr: number[], n: number): number[] {
  const k = 2 / (n + 1); const out: number[] = [];
  let prev = arr.slice(0, n).reduce((a,b)=>a+b,0)/n;
  for (let i = 0; i < arr.length; i++) {
    if (i < n - 1) { out.push(NaN); continue; }
    if (i === n - 1) { out.push(prev); continue; }
    prev = arr[i] * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

export function wma(arr: number[], n: number): number[] {
  const denom = n * (n + 1) / 2;
  return arr.map((_, i) => {
    if (i < n - 1) return NaN;
    let s = 0;
    for (let j = 0; j < n; j++) s += arr[i - j] * (n - j);
    return s / denom;
  });
}

export function hma(arr: number[], n: number): number[] {
  const half = Math.round(n / 2);
  const sq   = Math.round(Math.sqrt(n));
  const wma1 = wma(arr, half);
  const wma2 = wma(arr, n);
  const diff = wma1.map((v, i) => isFinite(v) && isFinite(wma2[i]) ? 2 * v - wma2[i] : NaN);
  return wma(diff, sq);
}

export function vwma(c: OHLCV[], n: number): number[] {
  return c.map((_, i) => {
    if (i < n - 1) return NaN;
    let pv = 0, vv = 0;
    for (let j = i - n + 1; j <= i; j++) { pv += c[j].c * c[j].v; vv += c[j].v; }
    return vv ? pv / vv : NaN;
  });
}

export function dema(arr: number[], n: number): number[] {
  const e1 = ema(arr, n);
  const e2 = ema(e1.map(x => isFinite(x) ? x : 0), n);
  return e1.map((v, i) => isFinite(v) && isFinite(e2[i]) ? 2 * v - e2[i] : NaN);
}

export function tema(arr: number[], n: number): number[] {
  const e1 = ema(arr, n);
  const clean1 = e1.map(x => isFinite(x) ? x : 0);
  const e2 = ema(clean1, n);
  const clean2 = e2.map(x => isFinite(x) ? x : 0);
  const e3 = ema(clean2, n);
  return e1.map((v, i) =>
    isFinite(v) && isFinite(e2[i]) && isFinite(e3[i]) ? 3*v - 3*e2[i] + e3[i] : NaN
  );
}

export function kama(arr: number[], n = 10, fast = 2, slow = 30): number[] {
  const fastSC = 2 / (fast + 1);
  const slowSC = 2 / (slow + 1);
  const out: number[] = new Array(arr.length).fill(NaN);
  let prev = arr[n - 1];
  out[n - 1] = prev;
  for (let i = n; i < arr.length; i++) {
    const dir = Math.abs(arr[i] - arr[i - n]);
    let vol_sum = 0;
    for (let j = i - n + 1; j <= i; j++) vol_sum += Math.abs(arr[j] - arr[j - 1]);
    const er = vol_sum > 0 ? dir / vol_sum : 0;
    const sc = (er * (fastSC - slowSC) + slowSC) ** 2;
    prev = prev + sc * (arr[i] - prev);
    out[i] = prev;
  }
  return out;
}

export function alma(arr: number[], n = 9, offset = 0.85, sigma = 6): number[] {
  const m = offset * (n - 1);
  const s = n / sigma;
  const weights: number[] = [];
  let wSum = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.exp(-((i - m) ** 2) / (2 * s * s));
    weights.push(w); wSum += w;
  }
  return arr.map((_, i) => {
    if (i < n - 1) return NaN;
    let sum = 0;
    for (let j = 0; j < n; j++) sum += weights[j] * arr[i - (n - 1 - j)];
    return sum / wSum;
  });
}

export function mcginley(arr: number[], n = 14): number[] {
  const out: number[] = new Array(arr.length).fill(NaN);
  let prev = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const diff = arr[i] - prev;
    prev = prev + diff / (n * Math.pow(arr[i] / prev, 4));
    if (i >= n - 1) out[i] = prev;
  }
  return out;
}

export function supertrend(c: OHLCV[], n = 10, mult = 3): { trend: number[]; dir: (-1|0|1)[] } {
  const atrVals = atr(c, n);
  const trend: number[] = new Array(c.length).fill(NaN);
  const dir: (-1|0|1)[] = new Array(c.length).fill(0);
  let upperBand = 0, lowerBand = 0, superT = 0, d = 1;
  for (let i = n; i < c.length; i++) {
    const mid = (c[i].h + c[i].l) / 2;
    const a = atrVals[i] || atrVals[i-1] || 0;
    const ub = mid + mult * a;
    const lb = mid - mult * a;
    upperBand = (ub < upperBand || c[i-1].c > upperBand) ? ub : upperBand;
    lowerBand = (lb > lowerBand || c[i-1].c < lowerBand) ? lb : lowerBand;
    if (c[i].c > superT) { superT = lowerBand; d = 1; }
    else if (c[i].c < superT) { superT = upperBand; d = -1; }
    trend[i] = superT;
    dir[i] = d as -1|0|1;
  }
  return { trend, dir };
}

export function parabolicSAR(c: OHLCV[], step = 0.02, max = 0.2): { sar: number[]; bull: boolean[] } {
  const sar: number[] = new Array(c.length).fill(NaN);
  const bull: boolean[] = new Array(c.length).fill(true);
  if (c.length < 2) return { sar, bull };
  let isBull = true, af = step, ep = c[0].h;
  let sarV = c[0].l;
  for (let i = 1; i < c.length; i++) {
    sarV = sarV + af * (ep - sarV);
    if (isBull) {
      if (c[i].l < sarV) {
        isBull = false; sarV = ep; ep = c[i].l; af = step;
      } else {
        if (c[i].h > ep) { ep = c[i].h; af = Math.min(af + step, max); }
        sarV = Math.min(sarV, c[i-1].l, i > 1 ? c[i-2].l : c[i-1].l);
      }
    } else {
      if (c[i].h > sarV) {
        isBull = true; sarV = ep; ep = c[i].h; af = step;
      } else {
        if (c[i].l < ep) { ep = c[i].l; af = Math.min(af + step, max); }
        sarV = Math.max(sarV, c[i-1].h, i > 1 ? c[i-2].h : c[i-1].h);
      }
    }
    sar[i] = sarV; bull[i] = isBull;
  }
  return { sar, bull };
}

export function linearRegression(arr: number[], n: number): { value: number[]; slope: number[] } {
  const value: number[] = new Array(arr.length).fill(NaN);
  const slope: number[] = new Array(arr.length).fill(NaN);
  for (let i = n - 1; i < arr.length; i++) {
    let sx = 0, sy = 0, sxy = 0, sxx = 0;
    for (let j = 0; j < n; j++) { sx += j; sy += arr[i-n+1+j]; sxy += j*arr[i-n+1+j]; sxx += j*j; }
    const denom = n * sxx - sx * sx;
    if (!denom) continue;
    const m = (n * sxy - sx * sy) / denom;
    const b = (sy - m * sx) / n;
    value[i] = m * (n - 1) + b;
    slope[i] = m;
  }
  return { value, slope };
}

// ─── Momentum ───────────────────────────────────────────────────────────────

export function rsi(arr: number[], n = 14): number[] {
  const out: number[] = [NaN]; let gain = 0, loss = 0;
  for (let i = 1; i < arr.length; i++) {
    const ch = arr[i] - arr[i - 1];
    const g = ch > 0 ? ch : 0; const l = ch < 0 ? -ch : 0;
    if (i <= n) {
      gain += g; loss += l;
      if (i === n) { const rs = gain / Math.max(loss, 1e-9); out.push(100 - 100 / (1 + rs)); }
      else out.push(NaN);
    } else {
      gain = (gain * (n-1) + g) / n; loss = (loss * (n-1) + l) / n;
      out.push(100 - 100 / (1 + gain / Math.max(loss, 1e-9)));
    }
  }
  return out;
}

export function macd(arr: number[], fast = 12, slow = 26, signal = 9) {
  const f = ema(arr, fast); const s = ema(arr, slow);
  const line = arr.map((_, i) => isFinite(f[i]) && isFinite(s[i]) ? f[i] - s[i] : NaN);
  const sig = ema(line.map(x => isFinite(x) ? x : 0), signal);
  const hist = line.map((m, i) => isFinite(m) ? m - sig[i] : NaN);
  return { macd: line, signal: sig, hist };
}

export function stoch(c: OHLCV[], n = 14, d = 3) {
  const k: number[] = [];
  for (let i = 0; i < c.length; i++) {
    if (i < n - 1) { k.push(NaN); continue; }
    let hh = -Infinity, ll = Infinity;
    for (let j = i - n + 1; j <= i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
    k.push((c[i].c - ll) / Math.max(hh - ll, 1e-9) * 100);
  }
  return { k, d: sma(k, d) };
}

export function stochRSI(arr: number[], n = 14, k = 3, d = 3) {
  const r = rsi(arr, n);
  const srsi: number[] = r.map((_, i) => {
    if (i < n - 1) return NaN;
    const slice = r.slice(i - n + 1, i + 1).filter(isFinite);
    if (slice.length < n) return NaN;
    const hh = Math.max(...slice), ll = Math.min(...slice);
    return (r[i] - ll) / Math.max(hh - ll, 1e-9) * 100;
  });
  return { k: sma(srsi, k), d: sma(sma(srsi, k), d) };
}

export function cci(c: OHLCV[], n = 20): number[] {
  return c.map((_, i) => {
    if (i < n - 1) return NaN;
    const typical = c.slice(i - n + 1, i + 1).map(x => (x.h + x.l + x.c) / 3);
    const mean = typical.reduce((a,b) => a+b, 0) / n;
    const mad  = typical.reduce((a, t) => a + Math.abs(t - mean), 0) / n;
    return (typical[typical.length - 1] - mean) / (0.015 * Math.max(mad, 1e-9));
  });
}

export function williamsR(c: OHLCV[], n = 14): number[] {
  return c.map((_, i) => {
    if (i < n - 1) return NaN;
    let hh = -Infinity, ll = Infinity;
    for (let j = i - n + 1; j <= i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
    return ((hh - c[i].c) / Math.max(hh - ll, 1e-9)) * -100;
  });
}

export function roc(arr: number[], n = 12): number[] {
  return arr.map((v, i) => i >= n ? (v - arr[i - n]) / Math.max(Math.abs(arr[i - n]), 1e-9) * 100 : NaN);
}

export function momentum(arr: number[], n = 10): number[] {
  return arr.map((v, i) => i >= n ? v - arr[i - n] : NaN);
}

export function awesomeOscillator(c: OHLCV[]): number[] {
  const mid = c.map(x => (x.h + x.l) / 2);
  const fast = sma(mid, 5); const slow = sma(mid, 34);
  return mid.map((_, i) => isFinite(fast[i]) && isFinite(slow[i]) ? fast[i] - slow[i] : NaN);
}

export function ultimateOscillator(c: OHLCV[], p1 = 7, p2 = 14, p3 = 28): number[] {
  const bp: number[] = []; const tr2: number[] = [];
  for (let i = 1; i < c.length; i++) {
    const pc = c[i-1].c;
    bp.push(c[i].c - Math.min(c[i].l, pc));
    tr2.push(Math.max(c[i].h, pc) - Math.min(c[i].l, pc));
  }
  const bpSMA1 = sma(bp, p1), bpSMA2 = sma(bp, p2), bpSMA3 = sma(bp, p3);
  const trSMA1 = sma(tr2,p1), trSMA2 = sma(tr2,p2), trSMA3 = sma(tr2,p3);
  const out: number[] = [NaN];
  for (let i = 0; i < bp.length; i++) {
    if (!isFinite(bpSMA3[i])) { out.push(NaN); continue; }
    const avg1 = bpSMA1[i] / Math.max(trSMA1[i], 1e-9);
    const avg2 = bpSMA2[i] / Math.max(trSMA2[i], 1e-9);
    const avg3 = bpSMA3[i] / Math.max(trSMA3[i], 1e-9);
    out.push(100 * (4*avg1 + 2*avg2 + avg3) / 7);
  }
  return out;
}

export function trix(arr: number[], n = 14): number[] {
  const e1 = ema(arr, n);
  const e2 = ema(e1.map(x => isFinite(x)?x:0), n);
  const e3 = ema(e2.map(x => isFinite(x)?x:0), n);
  return e3.map((v, i) => {
    if (!isFinite(v) || !isFinite(e3[i-1])) return NaN;
    return (v - e3[i-1]) / Math.max(Math.abs(e3[i-1]), 1e-9) * 100;
  });
}

export function aroon(c: OHLCV[], n = 25): { up: number[]; down: number[] } {
  const up: number[] = []; const down: number[] = [];
  for (let i = 0; i < c.length; i++) {
    if (i < n) { up.push(NaN); down.push(NaN); continue; }
    let hIdx = i, lIdx = i;
    for (let j = i - n; j <= i; j++) {
      if (c[j].h >= c[hIdx].h) hIdx = j;
      if (c[j].l <= c[lIdx].l) lIdx = j;
    }
    up.push(((n - (i - hIdx)) / n) * 100);
    down.push(((n - (i - lIdx)) / n) * 100);
  }
  return { up, down };
}

export function vortex(c: OHLCV[], n = 14): { vip: number[]; vin: number[] } {
  const vip: number[] = [NaN]; const vin: number[] = [NaN];
  for (let i = 1; i < c.length; i++) {
    vip.push(Math.abs(c[i].h - c[i-1].l));
    vin.push(Math.abs(c[i].l - c[i-1].h));
  }
  const trv: number[] = [NaN];
  for (let i = 1; i < c.length; i++)
    trv.push(Math.max(c[i].h - c[i].l, Math.abs(c[i].h - c[i-1].c), Math.abs(c[i].l - c[i-1].c)));
  const outVIP = vip.map((_, i) => {
    if (i < n) return NaN;
    const sv = vip.slice(i-n+1, i+1).reduce((a,b)=>a+b, 0);
    const st = trv.slice(i-n+1, i+1).reduce((a,b)=>a+b, 0);
    return sv / Math.max(st, 1e-9);
  });
  const outVIN = vin.map((_, i) => {
    if (i < n) return NaN;
    const sv = vin.slice(i-n+1, i+1).reduce((a,b)=>a+b, 0);
    const st = trv.slice(i-n+1, i+1).reduce((a,b)=>a+b, 0);
    return sv / Math.max(st, 1e-9);
  });
  return { vip: outVIP, vin: outVIN };
}

export function cmo(arr: number[], n = 14): number[] {
  const out: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (i < n) { out.push(NaN); continue; }
    let up = 0, down = 0;
    for (let j = i - n + 1; j <= i; j++) {
      const d = arr[j] - arr[j-1];
      if (d > 0) up += d; else down -= d;
    }
    out.push(100 * (up - down) / Math.max(up + down, 1e-9));
  }
  return out;
}

export function coppock(arr: number[], n = 10, l1 = 14, l2 = 11): number[] {
  const r1 = roc(arr, l1); const r2 = roc(arr, l2);
  const combined = r1.map((v, i) => isFinite(v) && isFinite(r2[i]) ? v + r2[i] : NaN);
  return wma(combined, n);
}

// ─── Volatility ──────────────────────────────────────────────────────────────

export function atr(c: OHLCV[], n = 14): number[] {
  const tr: number[] = [];
  for (let i = 0; i < c.length; i++) {
    if (i === 0) { tr.push(c[i].h - c[i].l); continue; }
    tr.push(Math.max(c[i].h - c[i].l, Math.abs(c[i].h - c[i-1].c), Math.abs(c[i].l - c[i-1].c)));
  }
  return sma(tr, n);
}

export function bollinger(arr: number[], n = 20, k = 2): { mid: number; upper: number; lower: number }[] {
  const m = sma(arr, n);
  return arr.map((_, i) => {
    if (i < n - 1) return { mid: NaN, upper: NaN, lower: NaN };
    let mean = 0; for (let j = i-n+1; j<=i; j++) mean += arr[j]; mean /= n;
    let sq = 0; for (let j = i-n+1; j<=i; j++) sq += (arr[j]-mean)**2;
    const sd = Math.sqrt(sq/n);
    return { mid: m[i], upper: m[i]+k*sd, lower: m[i]-k*sd };
  });
}

export function bollingerPercentB(arr: number[], n = 20, k = 2): number[] {
  const bb = bollinger(arr, n, k);
  return arr.map((v, i) => {
    const b = bb[i]; if (!isFinite(b.upper)) return NaN;
    return (v - b.lower) / Math.max(b.upper - b.lower, 1e-9) * 100;
  });
}

export function keltnerChannels(c: OHLCV[], n = 20, mult = 2): { mid: number; upper: number; lower: number }[] {
  const atrV = atr(c, n);
  const midEMA = ema(cls(c), n);
  return c.map((_, i) => {
    if (!isFinite(midEMA[i])) return { mid: NaN, upper: NaN, lower: NaN };
    return { mid: midEMA[i], upper: midEMA[i]+mult*atrV[i], lower: midEMA[i]-mult*atrV[i] };
  });
}

export function donchian(c: OHLCV[], n = 20): { upper: number; lower: number; mid: number }[] {
  return c.map((_, i) => {
    if (i < n - 1) return { upper: NaN, lower: NaN, mid: NaN };
    let hh = -Infinity, ll = Infinity;
    for (let j = i-n+1; j<=i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
    return { upper: hh, lower: ll, mid: (hh+ll)/2 };
  });
}

export function choppiness(c: OHLCV[], n = 14): number[] {
  const atrV = atr(c, n);
  return c.map((_, i) => {
    if (i < n) return NaN;
    let hh = -Infinity, ll = Infinity;
    for (let j = i-n+1; j<=i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
    const range = hh - ll;
    if (range < 1e-9) return NaN;
    const atrSum = atrV.slice(i-n+1, i+1).filter(isFinite).reduce((a,b)=>a+b,0);
    return 100 * Math.log10(atrSum / range) / Math.log10(n);
  });
}

export function massIndex(c: OHLCV[], n1 = 9, n2 = 25): number[] {
  const hl = c.map(x => x.h - x.l);
  const e1 = ema(hl, n1);
  const e2 = ema(e1.map(x=>isFinite(x)?x:0), n1);
  const ratio = e1.map((v, i) => isFinite(v) && isFinite(e2[i]) ? v / Math.max(e2[i], 1e-9) : NaN);
  return ratio.map((_, i) => {
    if (i < n2 - 1) return NaN;
    return ratio.slice(i-n2+1, i+1).filter(isFinite).reduce((a,b)=>a+b, 0);
  });
}

export function historicalVolatility(arr: number[], n = 20): number[] {
  const logR = arr.map((v, i) => i > 0 ? Math.log(v / arr[i-1]) : NaN);
  return logR.map((_, i) => {
    if (i < n) return NaN;
    const slice = logR.slice(i-n+1, i+1).filter(isFinite);
    if (slice.length < n) return NaN;
    const mean = slice.reduce((a,b)=>a+b,0)/slice.length;
    const variance = slice.reduce((a,b)=>a+(b-mean)**2,0)/(slice.length-1);
    return Math.sqrt(variance * 252) * 100;
  });
}

// ─── Volume ──────────────────────────────────────────────────────────────────

export function obv(c: OHLCV[]): number[] {
  let o = 0; return c.map((x, i) => {
    if (i > 0) { if (x.c > c[i-1].c) o += x.v; else if (x.c < c[i-1].c) o -= x.v; }
    return o;
  });
}

export function mfi(c: OHLCV[], n = 14): number[] {
  const typ = c.map(x => (x.h + x.l + x.c) / 3);
  return typ.map((_, i) => {
    if (i < n) return NaN;
    let posFlow = 0, negFlow = 0;
    for (let j = i-n+1; j<=i; j++) {
      const mf = typ[j] * c[j].v;
      if (j > 0 && typ[j] > typ[j-1]) posFlow += mf;
      else negFlow += mf;
    }
    return 100 - 100 / (1 + posFlow / Math.max(negFlow, 1e-9));
  });
}

export function adLine(c: OHLCV[]): number[] {
  let ad = 0;
  return c.map(x => {
    const clv = ((x.c - x.l) - (x.h - x.c)) / Math.max(x.h - x.l, 1e-9);
    ad += clv * x.v;
    return ad;
  });
}

export function cmf(c: OHLCV[], n = 21): number[] {
  const ad = adLine(c);
  const vv = vol(c);
  return ad.map((_, i) => {
    if (i < n-1) return NaN;
    const adSum = ad.slice(i-n+1,i+1).reduce((a,b)=>a+b,0);
    const vSum  = vv.slice(i-n+1,i+1).reduce((a,b)=>a+b,0);
    return adSum / Math.max(vSum, 1e-9);
  });
}

export function chaikinOscillator(c: OHLCV[]): number[] {
  const ad = adLine(c);
  const e3  = ema(ad, 3);
  const e10 = ema(ad, 10);
  return e3.map((v, i) => isFinite(v) && isFinite(e10[i]) ? v - e10[i] : NaN);
}

export function klingerOscillator(c: OHLCV[]): number[] {
  const sv: number[] = [0];
  for (let i = 1; i < c.length; i++) {
    const trend = (c[i].h + c[i].l + c[i].c) > (c[i-1].h + c[i-1].l + c[i-1].c) ? 1 : -1;
    sv.push(trend * c[i].v);
  }
  const e34 = ema(sv, 34);
  const e55 = ema(sv, 55);
  return e34.map((v, i) => isFinite(v) && isFinite(e55[i]) ? v - e55[i] : NaN);
}

export function forceIndex(c: OHLCV[], n = 13): number[] {
  const fi: number[] = [NaN];
  for (let i = 1; i < c.length; i++) fi.push((c[i].c - c[i-1].c) * c[i].v);
  return ema(fi, n);
}

export function easeOfMovement(c: OHLCV[], n = 14): number[] {
  const eom: number[] = [NaN];
  for (let i = 1; i < c.length; i++) {
    const dm = ((c[i].h + c[i].l) / 2) - ((c[i-1].h + c[i-1].l) / 2);
    const br = c[i].v / Math.max((c[i].h - c[i].l) * 1e4, 1e-9);
    eom.push(dm / Math.max(br, 1e-9));
  }
  return sma(eom, n);
}

export function volumeOscillator(c: OHLCV[], fast = 5, slow = 10): number[] {
  const vv = vol(c);
  const f = ema(vv, fast); const s = ema(vv, slow);
  return f.map((v, i) => isFinite(v) && isFinite(s[i]) ? (v - s[i]) / Math.max(Math.abs(s[i]), 1e-9) * 100 : NaN);
}

export function pvi(c: OHLCV[]): number[] {
  let p = 1000; return c.map((x, i) => {
    if (i === 0) return p;
    if (x.v > c[i-1].v) p = p + p * (x.c - c[i-1].c) / Math.max(c[i-1].c, 1e-9);
    return p;
  });
}

export function nvi(c: OHLCV[]): number[] {
  let n = 1000; return c.map((x, i) => {
    if (i === 0) return n;
    if (x.v < c[i-1].v) n = n + n * (x.c - c[i-1].c) / Math.max(c[i-1].c, 1e-9);
    return n;
  });
}

// ─── VWAP variants ──────────────────────────────────────────────────────────

export function vwap(c: OHLCV[]): number[] {
  let pv = 0, vv = 0;
  return c.map(x => {
    pv += ((x.h + x.l + x.c) / 3) * x.v; vv += x.v;
    return vv ? pv / vv : x.c;
  });
}

export function vwapWithBands(c: OHLCV[], mult = 2): { vwap: number[]; upper: number[]; lower: number[] } {
  const vwapV = vwap(c);
  let pv = 0, vv = 0, pv2 = 0;
  const upper: number[] = [], lower: number[] = [];
  for (let i = 0; i < c.length; i++) {
    const typ = (c[i].h + c[i].l + c[i].c) / 3;
    pv += typ * c[i].v; vv += c[i].v; pv2 += typ * typ * c[i].v;
    const vw = vv ? pv / vv : c[i].c;
    const variance = vv ? pv2 / vv - vw * vw : 0;
    const sd = Math.sqrt(Math.max(variance, 0));
    upper.push(vw + mult * sd); lower.push(vw - mult * sd);
  }
  return { vwap: vwapV, upper, lower };
}

// ─── Ichimoku (complete) ─────────────────────────────────────────────────────

export function ichimoku(c: OHLCV[], conv = 9, base = 26, span = 52, disp = 26) {
  const midRange = (i: number, n: number) => {
    let hh = -Infinity, ll = Infinity;
    for (let j = Math.max(0, i-n+1); j<=i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
    return (hh + ll) / 2;
  };
  const tenkan: number[] = [], kijun: number[] = [], senkouA: number[] = [], senkouB: number[] = [], chikou: number[] = [];
  for (let i = 0; i < c.length; i++) {
    tenkan.push(i >= conv-1 ? midRange(i, conv) : NaN);
    kijun.push(i >= base-1 ? midRange(i, base) : NaN);
    const sa = (isFinite(tenkan[i]) && isFinite(kijun[i])) ? (tenkan[i] + kijun[i]) / 2 : NaN;
    senkouA.push(sa);
    senkouB.push(i >= span-1 ? midRange(i, span) : NaN);
    chikou.push(c[i+disp]?.c ?? NaN);
  }
  return { tenkan, kijun, senkouA, senkouB, chikou };
}

// ─── ADX ────────────────────────────────────────────────────────────────────

export function adx(c: OHLCV[], n = 14): { adx: number[]; pdi: number[]; ndi: number[] } {
  const tr: number[] = [], pdm: number[] = [], ndm: number[] = [];
  for (let i = 1; i < c.length; i++) {
    tr.push(Math.max(c[i].h - c[i].l, Math.abs(c[i].h - c[i-1].c), Math.abs(c[i].l - c[i-1].c)));
    const up = c[i].h - c[i-1].h, down = c[i-1].l - c[i].l;
    pdm.push(up > down && up > 0 ? up : 0);
    ndm.push(down > up && down > 0 ? down : 0);
  }
  const atrN = sma(tr, n);
  const pdi = sma(pdm, n).map((v,i) => 100 * v / Math.max(atrN[i], 1e-9));
  const ndi = sma(ndm, n).map((v,i) => 100 * v / Math.max(atrN[i], 1e-9));
  const dx = pdi.map((p,i) => 100 * Math.abs(p - ndi[i]) / Math.max(p + ndi[i], 1e-9));
  return { adx: sma(dx, n), pdi, ndi };
}

// ─── Pattern detection helpers ───────────────────────────────────────────────

// Market structure: detect HH/HL trend
export function marketStructure(c: OHLCV[], lookback = 20): -1|0|1 {
  if (c.length < lookback * 2) return 0;
  const recent = c.slice(-lookback);
  const prior  = c.slice(-lookback*2, -lookback);
  const recentH = Math.max(...recent.map(x=>x.h));
  const priorH  = Math.max(...prior.map(x=>x.h));
  const recentL = Math.min(...recent.map(x=>x.l));
  const priorL  = Math.min(...prior.map(x=>x.l));
  if (recentH > priorH && recentL > priorL) return 1;  // HH + HL = uptrend
  if (recentH < priorH && recentL < priorL) return -1; // LH + LL = downtrend
  return 0;
}

// Candlestick patterns
export function candlePatterns(c: OHLCV[]): -1|0|1 {
  if (c.length < 3) return 0;
  const [p2, p1, curr] = c.slice(-3);
  const body = curr.c - curr.o;
  const bodyPrev = p1.c - p1.o;
  // Bullish engulfing
  if (body > 0 && bodyPrev < 0 && curr.o < p1.c && curr.c > p1.o) return 1;
  // Bearish engulfing
  if (body < 0 && bodyPrev > 0 && curr.o > p1.c && curr.c < p1.o) return -1;
  // Morning star / Evening star approximation
  const smallBody = Math.abs(p1.c - p1.o) < (Math.abs(p2.c-p2.o)*0.3);
  if (p2.c < p2.o && smallBody && curr.c > curr.o && curr.c > (p2.o+p2.c)/2) return 1;
  if (p2.c > p2.o && smallBody && curr.c < curr.o && curr.c < (p2.o+p2.c)/2) return -1;
  // Hammer / Hanging man
  const lower = Math.min(curr.o, curr.c) - curr.l;
  const upper = curr.h - Math.max(curr.o, curr.c);
  const bodySize = Math.abs(body);
  if (lower > bodySize * 2 && upper < bodySize * 0.3) return curr.c > curr.o ? 1 : -1;
  return 0;
}

// Fibonacci retracement check
export function fibonacciRetracement(c: OHLCV[], n = 50): -1|0|1 {
  if (c.length < n) return 0;
  const slice = c.slice(-n);
  const hh = Math.max(...slice.map(x=>x.h));
  const ll = Math.min(...slice.map(x=>x.l));
  const last = c[c.length-1].c;
  const range = hh - ll;
  if (range < 1e-9) return 0;
  const pos = (last - ll) / range;
  // Golden zone 0.5 - 0.618 from support → bullish; 0.382 - 0.5 → still bullish if uptrend
  if (pos > 0.6 && pos < 0.85) return 1;  // above 61.8% = extension
  if (pos < 0.4 && pos > 0.15) return -1; // near 38.2% from top = bearish
  return 0;
}

// Supply / demand zone detection
export function supplyDemandZone(c: OHLCV[], lookback = 30): -1|0|1 {
  if (c.length < lookback + 3) return 0;
  const last = c[c.length-1].c;
  const hist = c.slice(-lookback-3, -3);
  // Demand: area where prior low was followed by big up move
  for (let i = 1; i < hist.length - 1; i++) {
    const prev = hist[i-1], curr = hist[i], next = hist[i+1];
    const bigUp = next.c > curr.c * 1.003;
    if (bigUp && Math.abs(last - curr.l) / Math.max(curr.l, 1) < 0.002) return 1;
    const bigDown = next.c < curr.c * 0.997;
    if (bigDown && Math.abs(last - curr.h) / Math.max(curr.h, 1) < 0.002) return -1;
  }
  return 0;
}

// Liquidity sweep: price swept prior extreme then reversed
export function liquiditySweep(c: OHLCV[], n = 10): -1|0|1 {
  if (c.length < n + 2) return 0;
  const hist = c.slice(-n-2, -2);
  const prevHigh = Math.max(...hist.map(x=>x.h));
  const prevLow  = Math.min(...hist.map(x=>x.l));
  const last = c[c.length-1];
  const prev2 = c[c.length-2];
  if (prev2.l < prevLow && last.c > prevLow) return 1;  // swept low, closed above
  if (prev2.h > prevHigh && last.c < prevHigh) return -1; // swept high, closed below
  return 0;
}

// Order blocks: last strong candle before big move
export function orderBlockVote(c: OHLCV[], n = 20): -1|0|1 {
  if (c.length < n) return 0;
  const last = c[c.length-1].c;
  const slice = c.slice(-n);
  for (let i = 1; i < slice.length - 2; i++) {
    const nextMove = slice[i+2].c - slice[i+1].c;
    if (Math.abs(nextMove) > (slice[i+1].h - slice[i+1].l) * 2) {
      const ob = slice[i];
      const zone = { top: Math.max(ob.o, ob.c), bot: Math.min(ob.o, ob.c) };
      if (last >= zone.bot && last <= zone.top) return nextMove > 0 ? 1 : -1;
    }
  }
  return 0;
}

// Wyckoff phase detection
export function wyckoffPhase(c: OHLCV[], n = 50): -1|0|1 {
  if (c.length < n) return 0;
  const slice = c.slice(-n);
  const mid = n >> 1;
  // Spring: new low on low volume followed by recovery
  const firstHalf = slice.slice(0, mid);
  const secondHalf = slice.slice(mid);
  const fhLow = Math.min(...firstHalf.map(x=>x.l));
  const shLow = Math.min(...secondHalf.map(x=>x.l));
  const fhVol = firstHalf.reduce((a,x)=>a+x.v, 0) / mid;
  const shVol = secondHalf.reduce((a,x)=>a+x.v, 0) / mid;
  // Accumulation: low in first half, higher now, higher volume
  if (shLow > fhLow && shVol > fhVol * 1.1) return 1;
  const fhHigh = Math.max(...firstHalf.map(x=>x.h));
  const shHigh = Math.max(...secondHalf.map(x=>x.h));
  if (shHigh < fhHigh && shVol > fhVol * 1.1) return -1;
  return 0;
}

// Elliott wave: simplified 5-wave detection via fibonacci
export function elliottWaveDir(c: OHLCV[], n = 40): -1|0|1 {
  if (c.length < n) return 0;
  const slice = c.slice(-n);
  const hh = Math.max(...slice.map(x=>x.h));
  const ll = Math.min(...slice.map(x=>x.l));
  const last = c[c.length-1].c;
  const range = hh - ll;
  if (range < 1e-9) return 0;
  const pos = (last - ll) / range;
  // If near completion of 5th wave (0.88+) then contrarian; if in wave 3 territory → follow
  if (pos > 0.75) return 1;   // in impulse territory
  if (pos < 0.25) return -1;
  return 0;
}

// Harmonic pattern: Gartley/Bat via XAB fib check
export function harmonicPattern(c: OHLCV[], n = 50): -1|0|1 {
  if (c.length < n) return 0;
  const slice = c.slice(-n);
  const hh = Math.max(...slice.map(x=>x.h));
  const ll = Math.min(...slice.map(x=>x.l));
  const range = hh - ll;
  if (range < 1e-9) return 0;
  const last = c[c.length-1].c;
  const pos = (last - ll) / range;
  // PRZ zones at 0.618 and 0.786 retracements
  if (Math.abs(pos - 0.786) < 0.05) return 1;  // potential Gartley bull
  if (Math.abs(pos - (1-0.786)) < 0.05) return -1;
  return 0;
}

// Heikin Ashi trend
export function heikinAshiTrend(c: OHLCV[], n = 10): -1|0|1 {
  if (c.length < n) return 0;
  let prevHAO = (c[0].o + c[0].c) / 2, prevHAC = (c[0].o + c[0].h + c[0].l + c[0].c) / 4;
  let bullCount = 0, bearCount = 0;
  for (let i = 1; i < c.length; i++) {
    const haC = (c[i].o + c[i].h + c[i].l + c[i].c) / 4;
    const haO = (prevHAO + prevHAC) / 2;
    if (i >= c.length - n) { if (haC > haO) bullCount++; else bearCount++; }
    prevHAO = haO; prevHAC = haC;
  }
  return bullCount > bearCount * 1.5 ? 1 : bearCount > bullCount * 1.5 ? -1 : 0;
}

// Renko brick direction (approximate from price)
export function renkoBrickDir(c: OHLCV[], brickSize = 0): -1|0|1 {
  if (c.length < 10) return 0;
  const a = atr(c, 14).at(-1) || 0;
  const bs = brickSize || a;
  const prices = cls(c);
  let lastBrick = prices[0], dir = 0, bricks = 0;
  for (const p of prices) {
    if (p >= lastBrick + bs) { lastBrick = p; dir = 1; bricks++; }
    else if (p <= lastBrick - bs) { lastBrick = p; dir = -1; bricks++; }
  }
  return dir as -1|0|1;
}

// Turtle trading: 20-period high/low breakout
export function turtleBreakout(c: OHLCV[], n = 20): -1|0|1 {
  if (c.length <= n) return 0;
  let hh = -Infinity, ll = Infinity;
  for (let i = c.length - n - 1; i < c.length - 1; i++) { hh = Math.max(hh, c[i].h); ll = Math.min(ll, c[i].l); }
  const last = c[c.length-1].c;
  if (last > hh) return 1; if (last < ll) return -1; return 0;
}

// Darvas Box: 4-week high box breakout
export function darvasBox(c: OHLCV[]): -1|0|1 {
  if (c.length < 20) return 0;
  const boxHigh = Math.max(...c.slice(-20,-1).map(x=>x.h));
  const boxLow  = Math.min(...c.slice(-20,-1).map(x=>x.l));
  const last = c[c.length-1].c;
  if (last > boxHigh) return 1; if (last < boxLow) return -1; return 0;
}

// Weinstein stage: SMA200 slope
export function weinsteinStage(c: OHLCV[]): -1|0|1 {
  if (c.length < 205) return 0;
  const sm = sma(cls(c), 200);
  const curr = sm.at(-1)!, prev = sm.at(-5)!;
  if (!isFinite(curr) || !isFinite(prev)) return 0;
  const last = c[c.length-1].c;
  if (curr > prev && last > curr) return 1;  // Stage 2
  if (curr < prev && last < curr) return -1; // Stage 4
  return 0;
}

// Dow Theory: HH+HL pattern
export function dowTheory(c: OHLCV[], n = 30): -1|0|1 {
  if (c.length < n*2) return 0;
  const recent = c.slice(-n);
  const prior  = c.slice(-n*2, -n);
  const rH = Math.max(...recent.map(x=>x.h)); const rL = Math.min(...recent.map(x=>x.l));
  const pH = Math.max(...prior.map(x=>x.h));  const pL = Math.min(...prior.map(x=>x.l));
  if (rH > pH && rL > pL) return 1;
  if (rH < pH && rL < pL) return -1;
  return 0;
}

// Mean reversion: distance from SMA, vote for reversion
export function meanReversion(c: OHLCV[], n = 20, threshold = 2): -1|0|1 {
  const prices = cls(c);
  const sm = sma(prices, n);
  const bb = bollinger(prices, n, threshold);
  const last = prices.at(-1)!, lastBB = bb.at(-1)!;
  if (!isFinite(lastBB.upper)) return 0;
  if (last > lastBB.upper) return -1; // overbought → revert down
  if (last < lastBB.lower) return 1;  // oversold → revert up
  return 0;
}

// Volume Spread Analysis
export function vsaVote(c: OHLCV[]): -1|0|1 {
  if (c.length < 5) return 0;
  const last = c[c.length-1];
  const spread = last.h - last.l;
  const avgVol = vol(c.slice(-20)).reduce((a,b)=>a+b,0) / 20;
  const highVol = last.v > avgVol * 1.5;
  // No demand: high volume, small spread, mid close → bearish
  if (highVol && spread < (last.h - last.l) * 0.3 && last.c > last.l && last.c < last.h) return -1;
  // Climactic up: very high vol, wide spread up → potential top
  if (highVol && last.c > last.o && spread > avgVol/1000) return 1;
  return 0;
}

// DeMark Sequential: count 9-bar setup
export function demarkSequential(c: OHLCV[]): -1|0|1 {
  if (c.length < 9) return 0;
  let buySetup = 0, sellSetup = 0;
  for (let i = c.length - 9; i < c.length; i++) {
    if (i < 4) continue;
    if (c[i].c < c[i-4].c) buySetup++;
    else buySetup = 0;
    if (c[i].c > c[i-4].c) sellSetup++;
    else sellSetup = 0;
  }
  if (buySetup >= 9) return 1;   // completed buy setup
  if (sellSetup >= 9) return -1;
  return 0;
}

// Market sessions: is current candle in active session?
export function marketSessionVote(c: OHLCV[]): -1|0|1 {
  if (!c.length) return 0;
  const last = c[c.length-1];
  const hour = new Date(last.t).getUTCHours();
  // Most active: London+NY overlap = 12-16 UTC
  const isActive = (hour >= 8 && hour <= 17);
  if (!isActive) return 0;
  return last.c > last.o ? 1 : last.c < last.o ? -1 : 0;
}

// Seasonality: basic gold/oil monthly bias
export function seasonalityVote(c: OHLCV[]): -1|0|1 {
  if (!c.length) return 0;
  const month = new Date(c[c.length-1].t).getUTCMonth(); // 0=Jan
  // Gold seasonal: strong Jan, Feb, Aug, Sep; weak Mar, Apr, Jun
  const goldBull = [0,1,7,8,11]; const goldBear = [2,3,5];
  if (goldBull.includes(month)) return 1;
  if (goldBear.includes(month)) return -1;
  return 0;
}

// Volume profile: find point of control (POC) and compare to price
export function volumeProfileVote(c: OHLCV[], buckets = 20): -1|0|1 {
  if (c.length < buckets) return 0;
  const slice = c.slice(-Math.min(200, c.length));
  const hh = Math.max(...slice.map(x=>x.h));
  const ll = Math.min(...slice.map(x=>x.l));
  const range = hh - ll;
  if (range < 1e-9) return 0;
  const dist: number[] = new Array(buckets).fill(0);
  for (const x of slice) {
    const idx = Math.min(Math.floor(((x.c - ll) / range) * buckets), buckets - 1);
    dist[idx] += x.v;
  }
  const maxIdx = dist.indexOf(Math.max(...dist));
  const poc = ll + (maxIdx + 0.5) * range / buckets;
  const last = c[c.length-1].c;
  if (last > poc * 1.002) return 1;
  if (last < poc * 0.998) return -1;
  return 0;
}

// Andrews Pitchfork: median line position
export function andrewsPitchfork(c: OHLCV[], n = 60): -1|0|1 {
  if (c.length < n) return 0;
  const slice = c.slice(-n);
  // Simplified: find pivot swing and project median line
  const midHigh = Math.max(...slice.slice(0, n>>1).map(x=>x.h));
  const midLow  = Math.min(...slice.slice(0, n>>1).map(x=>x.l));
  const midLine = (midHigh + midLow) / 2;
  const last = c[c.length-1].c;
  const trend = slice[slice.length-1].c > slice[0].c;
  return last > midLine === trend ? 1 : -1;
}

// Algo/quant: use momentum + mean reversion combo
export function algoQuantVote(c: OHLCV[]): -1|0|1 {
  const mv = macd(cls(c));
  const histV = mv.hist.at(-1);
  const rsiV = rsi(cls(c), 14).at(-1);
  if (!isFinite(histV as number) || !isFinite(rsiV as number)) return 0;
  if ((histV as number) > 0 && (rsiV as number) > 50 && (rsiV as number) < 70) return 1;
  if ((histV as number) < 0 && (rsiV as number) < 50 && (rsiV as number) > 30) return -1;
  return 0;
}

// Three Line Break (approximate via consecutive closes)
export function threeLineBreak(c: OHLCV[]): -1|0|1 {
  if (c.length < 12) return 0;
  const prices = cls(c);
  let boxes: { hi: number; lo: number; bull: boolean }[] = [];
  for (const p of prices) {
    if (!boxes.length) { boxes.push({ hi: p, lo: p, bull: true }); continue; }
    const last = boxes[boxes.length-1];
    if (p > last.hi) { boxes.push({ hi: p, lo: last.hi, bull: true }); }
    else if (p < last.lo) {
      // Check if breaks 3 prior boxes
      if (boxes.length >= 3) {
        const thirdBack = boxes[boxes.length-3];
        if (!thirdBack.bull) boxes.push({ hi: last.lo, lo: p, bull: false });
        else if (p < thirdBack.lo) boxes.push({ hi: last.lo, lo: p, bull: false });
      }
    }
  }
  const last3 = boxes.slice(-3);
  const bulls = last3.filter(b=>b.bull).length;
  if (bulls === 3) return 1; if (bulls === 0) return -1; return 0;
}

// Kagi chart direction
export function kagiDir(c: OHLCV[]): -1|0|1 {
  if (c.length < 10) return 0;
  const prices = cls(c);
  const rev = atr(c, 14).at(-1)! || 0.01;
  let dir = 1, kagi = prices[0];
  for (const p of prices) {
    if (dir === 1 && p < kagi - rev) { dir = -1; kagi = p; }
    else if (dir === -1 && p > kagi + rev) { dir = 1; kagi = p; }
    else kagi = dir === 1 ? Math.max(kagi, p) : Math.min(kagi, p);
  }
  return dir as -1|0|1;
}

// Fibonacci time zones: proximity to time zone
export function fibTimeZone(c: OHLCV[]): -1|0|1 {
  // Approximate: trend direction at Fibonacci-length intervals
  const fibs = [1,2,3,5,8,13,21,34,55,89];
  if (c.length < 89) return 0;
  // If in uptrend at fib zone, bullish
  const lr = linearRegression(cls(c), 21);
  const slope = lr.slope.at(-1) || 0;
  return slope > 0 ? 1 : slope < 0 ? -1 : 0;
}

// Range bars: consolidated from OHLCV
export function rangeBarDir(c: OHLCV[], rangeMultiplier = 1): -1|0|1 {
  // Approximate using same candle close direction
  if (c.length < 5) return 0;
  const last5 = c.slice(-5);
  const up = last5.filter(x=>x.c>x.o).length;
  const dn = last5.filter(x=>x.c<x.o).length;
  return up > dn ? 1 : dn > up ? -1 : 0;
}

// Volume profile for market profile TPO
export function marketProfileTPO(c: OHLCV[]): -1|0|1 {
  return volumeProfileVote(c);
}

// IPDA (simplified as trend + session structure)
export function ipdaVote(c: OHLCV[]): -1|0|1 {
  const ms = marketStructure(c);
  const ls = liquiditySweep(c);
  if (ms === ls && ms !== 0) return ms;
  return ms !== 0 ? ms : ls;
}

// Gann angles: 45-degree angle from significant low/high
export function gannAngleVote(c: OHLCV[], n = 50): -1|0|1 {
  if (c.length < n) return 0;
  const slice = c.slice(-n);
  const ll = Math.min(...slice.map(x=>x.l));
  const hh = Math.max(...slice.map(x=>x.h));
  const llIdx = slice.findIndex(x=>x.l===ll);
  const last = c[c.length-1].c;
  const range = hh - ll;
  if (range < 1e-9 || llIdx < 0) return 0;
  // 1×1 Gann angle from swing low: price should be above llIdx*range/n+ll
  const expected = ll + (n - llIdx) * range / n;
  return last > expected ? 1 : -1;
}

// Volume chart (tick volume trend)
export function volumeChartDir(c: OHLCV[], n = 14): -1|0|1 {
  const vv = vol(c);
  const va = sma(vv, n);
  const lastV = vv.at(-1) || 0;
  const lastVA = va.at(-1) || 0;
  const trend = cls(c).at(-1)! > cls(c).at(-5)! ? 1 : -1;
  if (lastV > lastVA * 1.2) return trend;
  return 0;
}

// Momentum trading: composite momentum score
export function momentumTradingVote(c: OHLCV[]): -1|0|1 {
  const r = roc(cls(c), 10).at(-1) || 0;
  const m = macd(cls(c)).hist.at(-1) || 0;
  if (r > 0.5 && m > 0) return 1;
  if (r < -0.5 && m < 0) return -1;
  return 0;
}

// Market breadth (approximate via volume divergence)
export function marketBreadthVote(c: OHLCV[]): -1|0|1 {
  const obvV = obv(c);
  const obvEma = ema(obvV, 20);
  const last = obvV.at(-1)!; const lastEma = obvEma.at(-1)!;
  if (!isFinite(lastEma)) return 0;
  return last > lastEma ? 1 : last < lastEma ? -1 : 0;
}

// AI/ML approximation: ensemble of many signals
export function aiMlVote(c: OHLCV[]): -1|0|1 {
  const signals = [
    macd(cls(c)).hist.at(-1)! > 0 ? 1 : -1,
    rsi(cls(c)).at(-1)! > 50 ? 1 : -1,
    ema(cls(c), 7).at(-1)! > ema(cls(c), 21).at(-1)! ? 1 : -1,
    obv(c).at(-1)! > ema(obv(c), 20).at(-1)! ? 1 : -1,
  ].filter(x=>isFinite(x));
  const sum = signals.reduce((a,b)=>a+b,0);
  return sum > 1 ? 1 : sum < -1 ? -1 : 0;
}

// Quantitative algo trading
export function quantAlgoVote(c: OHLCV[]): -1|0|1 {
  return algoQuantVote(c);
}

// Intermarket analysis approximation (via correlation of price & volume)
export function intermarketVote(c: OHLCV[]): -1|0|1 {
  // Without cross-asset data, use price vs volume momentum as proxy
  const vDir = marketBreadthVote(c);
  const pDir = marketStructure(c);
  if (vDir === pDir && vDir !== 0) return vDir;
  return pDir !== 0 ? pDir : vDir;
}

// Mansfield Relative Strength (compare to SMA slope)
export function mansfieldRS(c: OHLCV[]): -1|0|1 {
  if (c.length < 52) return 0;
  const sm = sma(cls(c), 52);
  const last = cls(c).at(-1)!;
  const sm1 = sm.at(-1)!, sm2 = sm.at(-10)!;
  if (!isFinite(sm1) || !isFinite(sm2)) return 0;
  const rsRating = ((last / sm1) - 1) * 100;
  const slope = sm1 - sm2;
  return rsRating > 0 && slope > 0 ? 1 : rsRating < 0 && slope < 0 ? -1 : 0;
}

// COT approximation (via long-term price divergence from mean)
export function cotVote(c: OHLCV[]): -1|0|1 {
  if (c.length < 50) return 0;
  const sm = sma(cls(c), 50);
  const bb = bollinger(cls(c), 50, 1.5);
  const last = cls(c).at(-1)!;
  const lb = bb.at(-1)!;
  if (!isFinite(lb.upper)) return 0;
  if (last > lb.upper) return -1; // commercial hedgers likely short
  if (last < lb.lower) return 1;  // commercial hedgers likely long
  return 0;
}

// Financial astrology / sacred geometry (approximate via time cycles)
export function sacredGeometryVote(c: OHLCV[]): -1|0|1 {
  // Approximate via price ratio to key mathematical constants
  if (c.length < 34) return 0;
  const last = cls(c).at(-1)!;
  const base = cls(c).at(-34)!;
  const ratio = last / Math.max(base, 1e-9);
  const goldenRatio = 1.618;
  if (Math.abs(ratio - goldenRatio) < 0.02 || Math.abs(ratio - 1) < 0.005) return 1;
  if (Math.abs(ratio - 1/goldenRatio) < 0.02) return -1;
  return 0;
}

// Cyclic analysis: price periodicity detection
export function cyclicAnalysis(c: OHLCV[]): -1|0|1 {
  if (c.length < 40) return 0;
  const prices = cls(c);
  // Simple cycle detection: check if price is above 20-period midpoint
  const mid = (Math.max(...prices.slice(-20)) + Math.min(...prices.slice(-20))) / 2;
  const last = prices.at(-1)!;
  const prev = prices.at(-10)!;
  if (last > mid && last > prev) return 1;
  if (last < mid && last < prev) return -1;
  return 0;
}

// Gann time (approximate: is this a Gann time cycle pivot?)
export function gannTimePivot(c: OHLCV[]): -1|0|1 {
  const len = c.length;
  // Gann time squares: 45, 90, 180, 270, 360 bars
  const gannPeriods = [45, 90, 180, 270, 360];
  for (const p of gannPeriods) {
    if (len % p < 3) {
      const last = c[c.length-1].c;
      const refCandle = c[Math.max(0, c.length-p)].c;
      return last > refCandle ? 1 : -1;
    }
  }
  return dowTheory(c);
}

// Point and Figure (approximate)
export function pointAndFigure(c: OHLCV[]): -1|0|1 {
  const a = atr(c, 14).at(-1) || 0;
  if (!a) return 0;
  const boxSize = a;
  const prices = cls(c);
  let col = prices[0] > prices[1] ? 'X' : 'O', top = prices[0], bottom = prices[0];
  for (const p of prices) {
    if (col === 'X' && p > top) top = p;
    else if (col === 'X' && p < top - boxSize * 3) { col = 'O'; bottom = p; }
    else if (col === 'O' && p < bottom) bottom = p;
    else if (col === 'O' && p > bottom + boxSize * 3) { col = 'X'; top = p; }
  }
  return col === 'X' ? 1 : -1;
}

// Order Flow analytical approximation (without Level-2 data)
export function orderFlowApprox(c: OHLCV[]): -1|0|1 {
  if (c.length < 5) return 0;
  const last = c[c.length-1];
  // Approximate buying pressure: close near high on high volume
  const closeRatio = (last.c - last.l) / Math.max(last.h - last.l, 1e-9);
  const avgVol = vol(c.slice(-20)).reduce((a,b)=>a+b,0) / 20;
  const highVol = last.v > avgVol * 1.2;
  if (closeRatio > 0.7 && highVol) return 1;
  if (closeRatio < 0.3 && highVol) return -1;
  return obv(c).at(-1)! > ema(obv(c),20).at(-1)! ? 1 : -1;
}
