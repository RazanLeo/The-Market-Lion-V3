import type { Timeframe } from "@/data/timeframes";

export type Direction = "BUY" | "SELL" | "NEUTRAL";

export type RowDecision = {
  // Per-row decision per timeframe (-1 sell, 0 neutral, +1 buy)
  perTf: Record<Timeframe, -1 | 0 | 1>;
  // Weighted sum based on TF weights / 100
  weighted: number;
  // Final decision label using table threshold
  decision: Direction;
  confidence: number; // 0..1
  alignment: number;  // 0..1 — how aligned timeframes are
};

export type AssetState = {
  symbol: string;
  price: number;
  changePct: number;
  ts: number;
};

export type AnalysisInput = {
  candles: Record<Timeframe, OHLCV[]>;
  asset: string;
};

export type OHLCV = {
  t: number; o: number; h: number; l: number; c: number; v: number;
};
