// Final voting engine: combine all 5 tables with their weights → Buy Lion / Sell Lion
import { TABLE_WEIGHTS, SIGNAL_TIERS, BOT_ENTRY } from "@/data/weights";
import { TIMEFRAMES, TF_WEIGHTS, Timeframe } from "@/data/timeframes";

export type TableSummary = {
  // Average weighted score (-1..+1) for each timeframe across all rows in this table.
  perTf: Record<Timeframe, number>;
  // Average over timeframes (using TF weights again).
  composite: number;
  // 0..1
  confidence: number;
};

export type ConfluenceResult = {
  perTf: Record<Timeframe, number>;          // -100..+100 (signed %)
  daily: number;                             // -100..+100
  abs: number;                               // 0..100
  direction: "BUY" | "SELL" | "NEUTRAL";
  tier: "CROWN" | "STRONG" | "WEAK" | "NONE";
  tierLabel: string;
  tierLabelAr: string;
  shouldBotEnter: boolean;                   // gate
};

export function combineTables(s: {
  fundamental: TableSummary;
  coreTools: TableSummary;
  schools: TableSummary;
  indicators: TableSummary;
  orderFlow: TableSummary;
}): ConfluenceResult {
  const perTf: Record<Timeframe, number> = {} as any;
  for (const tf of TIMEFRAMES) {
    const total =
      s.fundamental.perTf[tf] * TABLE_WEIGHTS.fundamental +
      s.coreTools.perTf[tf]   * TABLE_WEIGHTS.coreTools   +
      s.schools.perTf[tf]     * TABLE_WEIGHTS.schools     +
      s.indicators.perTf[tf]  * TABLE_WEIGHTS.indicators  +
      s.orderFlow.perTf[tf]   * TABLE_WEIGHTS.orderFlow;
    // total is roughly in (-100..+100)
    perTf[tf] = Math.max(-100, Math.min(100, total));
  }
  // Daily = TF-weighted avg of perTf
  let dailyNum = 0;
  let dailyDen = 0;
  for (const tf of TIMEFRAMES) {
    dailyNum += perTf[tf] * TF_WEIGHTS[tf];
    dailyDen += TF_WEIGHTS[tf];
  }
  const daily = dailyNum / dailyDen;
  const abs = Math.abs(daily);

  const direction = daily > 1 ? "BUY" : daily < -1 ? "SELL" : "NEUTRAL";

  const tier =
    abs >= SIGNAL_TIERS.CROWN.min  ? "CROWN"  :
    abs >= SIGNAL_TIERS.STRONG.min ? "STRONG" :
    abs >= SIGNAL_TIERS.WEAK.min   ? "WEAK"   : "NONE";

  return {
    perTf,
    daily,
    abs,
    direction,
    tier,
    tierLabel:   SIGNAL_TIERS[tier].label,
    tierLabelAr: SIGNAL_TIERS[tier].labelAr,
    shouldBotEnter: abs >= BOT_ENTRY.MIN_CONFLUENCE && direction !== "NEUTRAL",
  };
}
