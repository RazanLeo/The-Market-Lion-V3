// Pure-JS technical indicator computations used across the analysis engine.
import type { OHLCV } from "./types";

const closes = (c: OHLCV[]) => c.map(x => x.c);
const highs  = (c: OHLCV[]) => c.map(x => x.h);
const lows   = (c: OHLCV[]) => c.map(x => x.l);

export function sma(arr: number[], n: number) {
  const out: number[] = []; let s = 0;
  for (let i = 0; i < arr.length; i++) {
    s += arr[i]; if (i >= n) s -= arr[i - n];
    out.push(i >= n - 1 ? s / n : NaN);
  }
  return out;
}
export function ema(arr: number[], n: number) {
  const k = 2 / (n + 1); const out: number[] = []; let prev = arr[0];
  for (let i = 0; i < arr.length; i++) {
    prev = i === 0 ? arr[0] : arr[i] * k + prev * (1 - k);
    out.push(i >= n - 1 ? prev : NaN);
  }
  return out;
}
export function rsi(arr: number[], n = 14) {
  const out: number[] = []; let gain = 0, loss = 0;
  for (let i = 1; i < arr.length; i++) {
    const ch = arr[i] - arr[i - 1];
    const g = ch > 0 ? ch : 0; const l = ch < 0 ? -ch : 0;
    if (i <= n) { gain += g; loss += l; if (i === n) { const rs = gain / Math.max(loss,1e-9); out[i] = 100 - 100/(1+rs); } else out[i] = NaN; }
    else { gain = (gain*(n-1) + g)/n; loss = (loss*(n-1) + l)/n; const rs = gain/Math.max(loss,1e-9); out[i] = 100 - 100/(1+rs); }
  }
  out[0] = NaN; return out;
}
export function atr(c: OHLCV[], n = 14) {
  const tr: number[] = [];
  for (let i = 0; i < c.length; i++) {
    if (i === 0) { tr.push(c[i].h - c[i].l); continue; }
    tr.push(Math.max(c[i].h - c[i].l, Math.abs(c[i].h - c[i-1].c), Math.abs(c[i].l - c[i-1].c)));
  }
  return sma(tr, n);
}
export function macd(arr: number[], fast = 12, slow = 26, signal = 9) {
  const f = ema(arr, fast); const s = ema(arr, slow);
  const macdLine = arr.map((_, i) => (isFinite(f[i]) && isFinite(s[i])) ? f[i] - s[i] : NaN);
  const signalLine = ema(macdLine.map(x => isFinite(x) ? x : 0), signal);
  const hist = macdLine.map((m,i) => isFinite(m) ? m - signalLine[i] : NaN);
  return { macd: macdLine, signal: signalLine, hist };
}
export function bollinger(arr: number[], n = 20, k = 2) {
  const m = sma(arr, n); const out = arr.map((_,i) => {
    if (i < n - 1) return { mid: NaN, upper: NaN, lower: NaN };
    let mean = 0; for (let j = i - n + 1; j <= i; j++) mean += arr[j]; mean /= n;
    let sq = 0; for (let j = i - n + 1; j <= i; j++) sq += (arr[j] - mean) ** 2;
    const sd = Math.sqrt(sq / n);
    return { mid: m[i], upper: m[i] + k * sd, lower: m[i] - k * sd };
  });
  return out;
}
export function stoch(c: OHLCV[], n = 14, d = 3) {
  const k: number[] = [];
  for (let i = 0; i < c.length; i++) {
    if (i < n - 1) { k.push(NaN); continue; }
    let hh = -Infinity, ll = Infinity;
    for (let j = i - n + 1; j <= i; j++) { hh = Math.max(hh, c[j].h); ll = Math.min(ll, c[j].l); }
    k.push((c[i].c - ll) / Math.max(hh - ll, 1e-9) * 100);
  }
  const dArr = sma(k, d);
  return { k, d: dArr };
}
export function adx(c: OHLCV[], n = 14) {
  const tr: number[] = []; const pdm: number[] = []; const ndm: number[] = [];
  for (let i = 1; i < c.length; i++) {
    tr.push(Math.max(c[i].h - c[i].l, Math.abs(c[i].h - c[i-1].c), Math.abs(c[i].l - c[i-1].c)));
    const up = c[i].h - c[i-1].h; const down = c[i-1].l - c[i].l;
    pdm.push(up > down && up > 0 ? up : 0);
    ndm.push(down > up && down > 0 ? down : 0);
  }
  const atrN = sma(tr, n); const pdi = sma(pdm, n).map((v,i) => 100 * v / Math.max(atrN[i], 1e-9));
  const ndi = sma(ndm, n).map((v,i) => 100 * v / Math.max(atrN[i], 1e-9));
  const dx = pdi.map((p,i) => 100 * Math.abs(p - ndi[i]) / Math.max(p + ndi[i], 1e-9));
  const adxOut = sma(dx, n);
  return { adx: adxOut, pdi, ndi };
}

export const helpers = { closes, highs, lows };
