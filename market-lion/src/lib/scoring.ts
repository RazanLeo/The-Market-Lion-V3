// Core scoring & voting engine - exact weights from prompt
import { TF_WEIGHTS, TIMEFRAMES, Timeframe } from "@/data/timeframes";
import { DECISION_THRESHOLD } from "@/data/weights";
import type { RowDecision, Direction } from "./types";

/**
 * Convert a per-timeframe vote map (-1/0/+1) into a weighted decision per the master formula:
 * weighted = ((1M*5) + (5M*10) + (15M*20) + (30M*18) + (1H*22) + (4H*25)) / 100
 */
export function weightedRowScore(perTf: Record<Timeframe, -1 | 0 | 1>): number {
  let sum = 0;
  for (const tf of TIMEFRAMES) sum += (perTf[tf] || 0) * TF_WEIGHTS[tf];
  return sum / 100;
}

/** Decide row direction based on table-specific threshold */
export function rowDirection(weighted: number, table: "coreTools" | "schools" | "indicators" | "orderFlow"): Direction {
  const t = DECISION_THRESHOLD[table];
  if (weighted > t) return "BUY";
  if (weighted < -t) return "SELL";
  return "NEUTRAL";
}

/** Confidence = |score| / max possible (=1) */
export function rowConfidence(weighted: number) {
  return Math.min(Math.abs(weighted), 1);
}

/** Alignment = fraction of timeframes pointing the same direction as the dominant vote */
export function rowAlignment(perTf: Record<Timeframe, -1 | 0 | 1>): number {
  const tally: Record<number, number> = { "-1": 0, "0": 0, "1": 0 };
  for (const tf of TIMEFRAMES) tally[perTf[tf]]++;
  const dominant = Math.max(tally["-1"], tally["1"]);
  return dominant / TIMEFRAMES.length;
}

export function buildRowDecision(perTf: Record<Timeframe, -1 | 0 | 1>, table: "coreTools" | "schools" | "indicators" | "orderFlow"): RowDecision {
  const weighted = weightedRowScore(perTf);
  return {
    perTf,
    weighted,
    decision: rowDirection(weighted, table),
    confidence: rowConfidence(weighted),
    alignment: rowAlignment(perTf),
  };
}
