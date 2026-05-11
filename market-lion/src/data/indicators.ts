// Table 5 — التحليل الفني / المؤشرات الفنية (54 مؤشر) — وزن 10%
import type { Tier } from "./coreTools";

export type IndicatorDef = {
  id: number;
  nameAr: string;
  nameEn: string;
  category: "Trend" | "Momentum" | "Volatility" | "Volume" | "Smart-Money" | "Composite";
  tier: Tier;
};

export const INDICATORS: IndicatorDef[] = [
  // (a) Trend (11)
  { id: 1,  nameAr: "Parabolic SAR", nameEn: "Parabolic SAR", category: "Trend", tier: "A" },
  { id: 2,  nameAr: "Supertrend", nameEn: "Supertrend", category: "Trend", tier: "A" },
  { id: 3,  nameAr: "WMA — Weighted MA", nameEn: "WMA", category: "Trend", tier: "B" },
  { id: 4,  nameAr: "HMA — Hull MA", nameEn: "HMA", category: "Trend", tier: "A" },
  { id: 5,  nameAr: "VWMA — Volume Weighted MA", nameEn: "VWMA", category: "Trend", tier: "A" },
  { id: 6,  nameAr: "DEMA — Double Exponential MA", nameEn: "DEMA", category: "Trend", tier: "B" },
  { id: 7,  nameAr: "TEMA — Triple Exponential MA", nameEn: "TEMA", category: "Trend", tier: "B" },
  { id: 8,  nameAr: "KAMA — Kaufman Adaptive MA", nameEn: "KAMA", category: "Trend", tier: "A" },
  { id: 9,  nameAr: "ALMA — Arnaud Legoux MA", nameEn: "ALMA", category: "Trend", tier: "B" },
  { id: 10, nameAr: "McGinley Dynamic", nameEn: "McGinley Dynamic", category: "Trend", tier: "B" },
  { id: 11, nameAr: "Volatility Stop", nameEn: "Volatility Stop", category: "Trend", tier: "B" },
  // (b) Momentum (15)
  { id: 12, nameAr: "MACD", nameEn: "MACD", category: "Momentum", tier: "S" },
  { id: 13, nameAr: "Stochastic Oscillator", nameEn: "Stochastic Oscillator", category: "Momentum", tier: "A" },
  { id: 14, nameAr: "Stochastic RSI", nameEn: "Stochastic RSI", category: "Momentum", tier: "A" },
  { id: 15, nameAr: "ADX + DMI", nameEn: "ADX + DMI", category: "Momentum", tier: "A" },
  { id: 16, nameAr: "CCI", nameEn: "CCI", category: "Momentum", tier: "B" },
  { id: 17, nameAr: "Williams %R", nameEn: "Williams %R", category: "Momentum", tier: "B" },
  { id: 18, nameAr: "ROC — Rate of Change", nameEn: "ROC", category: "Momentum", tier: "B" },
  { id: 19, nameAr: "Momentum", nameEn: "Momentum", category: "Momentum", tier: "B" },
  { id: 20, nameAr: "Awesome Oscillator", nameEn: "Awesome Oscillator", category: "Momentum", tier: "B" },
  { id: 21, nameAr: "Ultimate Oscillator", nameEn: "Ultimate Oscillator", category: "Momentum", tier: "B" },
  { id: 22, nameAr: "TRIX", nameEn: "TRIX", category: "Momentum", tier: "B" },
  { id: 23, nameAr: "Aroon Indicator + Oscillator", nameEn: "Aroon", category: "Momentum", tier: "B" },
  { id: 24, nameAr: "Vortex Indicator (VI)", nameEn: "Vortex Indicator", category: "Momentum", tier: "B" },
  { id: 25, nameAr: "Coppock Curve", nameEn: "Coppock Curve", category: "Momentum", tier: "B" },
  { id: 26, nameAr: "Chande Momentum Oscillator", nameEn: "Chande Momentum Osc.", category: "Momentum", tier: "B" },
  // (c) Volatility (9)
  { id: 27, nameAr: "Bollinger Bands", nameEn: "Bollinger Bands", category: "Volatility", tier: "S" },
  { id: 28, nameAr: "ATR — Average True Range", nameEn: "ATR", category: "Volatility", tier: "S" },
  { id: 29, nameAr: "Keltner Channels", nameEn: "Keltner Channels", category: "Volatility", tier: "A" },
  { id: 30, nameAr: "Donchian Channels", nameEn: "Donchian Channels", category: "Volatility", tier: "A" },
  { id: 31, nameAr: "Historical Volatility", nameEn: "Historical Volatility", category: "Volatility", tier: "B" },
  { id: 32, nameAr: "Choppiness Index", nameEn: "Choppiness Index", category: "Volatility", tier: "B" },
  { id: 33, nameAr: "Chaikin Volatility", nameEn: "Chaikin Volatility", category: "Volatility", tier: "B" },
  { id: 34, nameAr: "Mass Index", nameEn: "Mass Index", category: "Volatility", tier: "B" },
  { id: 35, nameAr: "Volatility Index (VIX-style)", nameEn: "Volatility Index", category: "Volatility", tier: "B" },
  // (d) Volume (11)
  { id: 36, nameAr: "OBV — On Balance Volume", nameEn: "OBV", category: "Volume", tier: "A" },
  { id: 37, nameAr: "MFI — Money Flow Index", nameEn: "MFI", category: "Volume", tier: "A" },
  { id: 38, nameAr: "Accumulation / Distribution", nameEn: "A/D", category: "Volume", tier: "A" },
  { id: 39, nameAr: "Chaikin Money Flow", nameEn: "Chaikin Money Flow", category: "Volume", tier: "A" },
  { id: 40, nameAr: "Chaikin Oscillator", nameEn: "Chaikin Oscillator", category: "Volume", tier: "B" },
  { id: 41, nameAr: "Klinger Oscillator", nameEn: "Klinger Oscillator", category: "Volume", tier: "B" },
  { id: 42, nameAr: "Force Index", nameEn: "Force Index", category: "Volume", tier: "B" },
  { id: 43, nameAr: "Ease of Movement", nameEn: "Ease of Movement", category: "Volume", tier: "B" },
  { id: 44, nameAr: "Volume Oscillator", nameEn: "Volume Oscillator", category: "Volume", tier: "B" },
  { id: 45, nameAr: "Positive Volume Index (PVI)", nameEn: "PVI", category: "Volume", tier: "B" },
  { id: 46, nameAr: "Negative Volume Index (NVI)", nameEn: "NVI", category: "Volume", tier: "B" },
  // (e) Smart Money (3)
  { id: 47, nameAr: "VWAP الأساسي", nameEn: "VWAP", category: "Smart-Money", tier: "S" },
  { id: 48, nameAr: "Anchored VWAP", nameEn: "Anchored VWAP", category: "Smart-Money", tier: "S" },
  { id: 49, nameAr: "VWAP with Std-Dev Bands", nameEn: "VWAP ± StdDev Bands", category: "Smart-Money", tier: "A" },
  // (f) Composite systems (5)
  { id: 50, nameAr: "Ichimoku Kinko Hyo", nameEn: "Ichimoku Cloud", category: "Composite", tier: "S" },
  { id: 51, nameAr: "Bollinger %B + Bandwidth", nameEn: "BB %B + Bandwidth", category: "Composite", tier: "A" },
  { id: 52, nameAr: "McClellan Oscillator", nameEn: "McClellan Oscillator", category: "Composite", tier: "B" },
  { id: 53, nameAr: "Arms Index (TRIN)", nameEn: "TRIN", category: "Composite", tier: "B" },
  { id: 54, nameAr: "Advance / Decline Line", nameEn: "Advance/Decline Line", category: "Composite", tier: "B" },
];
