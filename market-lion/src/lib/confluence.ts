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
  // If fundamental data has no live signal (confidence near zero),
  // redistribute its 20% weight proportionally to the other four tables
  // so the score isn't artificially diluted.
  const fundLive = s.fundamental.confidence > 0.01;
  const weights = fundLive
    ? TABLE_WEIGHTS
    : (() => {
        const rem = 100 - TABLE_WEIGHTS.fundamental;
        return {
          fundamental: 0,
          coreTools:   TABLE_WEIGHTS.coreTools   * 100 / rem,
          schools:     TABLE_WEIGHTS.schools     * 100 / rem,
          indicators:  TABLE_WEIGHTS.indicators  * 100 / rem,
          orderFlow:   TABLE_WEIGHTS.orderFlow   * 100 / rem,
        };
      })();

  const perTf: Record<Timeframe, number> = {} as any;
  for (const tf of TIMEFRAMES) {
    const total =
      s.fundamental.perTf[tf] * weights.fundamental +
      s.coreTools.perTf[tf]   * weights.coreTools   +
      s.schools.perTf[tf]     * weights.schools     +
      s.indicators.perTf[tf]  * weights.indicators  +
      s.orderFlow.perTf[tf]   * weights.orderFlow;
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
