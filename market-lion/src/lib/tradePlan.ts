// Build the trading plan once a confluence decision is reached
import { BOT_ENTRY } from "@/data/weights";

export type TradeLevels = {
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  riskPerUnit: number;   // Distance in price between entry and SL
};

export type LotSizing = {
  capital: number;
  riskPct: number;       // user-chosen, capped at MAX_RISK_PCT
  riskAmount: number;
  pipValuePerLot: number;
  stopLossPips: number;
  lots: number;
};

export function clampRiskPct(riskPct: number) {
  return Math.max(0.1, Math.min(BOT_ENTRY.MAX_RISK_PCT, riskPct));
}

export function buildLevels(direction: "BUY"|"SELL", entry: number, atr: number): TradeLevels {
  // SL based on ATR multiple (1.5x ATR by default + small buffer)
  const slDist = Math.max(atr * 1.5, entry * 0.0008);
  if (direction === "BUY") {
    return {
      entry, sl: entry - slDist,
      tp1: entry + slDist,
      tp2: entry + slDist * 2,
      tp3: entry + slDist * 3,
      tp4: entry + slDist * 4,
      riskPerUnit: slDist,
    };
  }
  return {
    entry, sl: entry + slDist,
    tp1: entry - slDist,
    tp2: entry - slDist * 2,
    tp3: entry - slDist * 3,
    tp4: entry - slDist * 4,
    riskPerUnit: slDist,
  };
}

export function computeLotSize(p: { capital: number; riskPct: number; pipValuePerLot: number; stopLossPips: number }): LotSizing {
  const riskPct = clampRiskPct(p.riskPct);
  const riskAmount = p.capital * (riskPct / 100);
  const lots = p.stopLossPips > 0 && p.pipValuePerLot > 0
    ? riskAmount / (p.stopLossPips * p.pipValuePerLot)
    : 0;
  return { ...p, riskPct, riskAmount, lots: Math.max(0.01, Number(lots.toFixed(2))) };
}

export function effectiveRR(levels: TradeLevels) {
  return Math.abs(levels.tp4 - levels.entry) / Math.abs(levels.sl - levels.entry);
}

/**
 * Move SL to the previous TP after each target is hit (trailing stop progression).
 * TP1 hit → SL moves to breakeven (entry)
 * TP2 hit → SL moves to TP1
 * TP3 hit → SL moves to TP2
 * TP4 hit → SL moves to TP3 (partial close, let rest run)
 */
export function applyTrailing(levels: TradeLevels, hitTP: 1|2|3|4): TradeLevels {
  const newSl =
    hitTP === 1 ? levels.entry :
    hitTP === 2 ? levels.tp1   :
    hitTP === 3 ? levels.tp2   :
                  levels.tp3;
  return { ...levels, sl: newSl };
}
