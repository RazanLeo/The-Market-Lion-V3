// Weights of each table (sum = 100%)
export const TABLE_WEIGHTS = {
  fundamental: 20,    // Table 2
  coreTools:   30,    // Table 3 (23 tools)
  schools:     25,    // Table 4 (48 schools)
  indicators:  10,    // Table 5 (54 indicators)
  orderFlow:   15,    // Table 6 (10 tools)
} as const;

// Decision thresholds in each table
export const DECISION_THRESHOLD = {
  coreTools:  0.015,  // Table 3
  schools:    0.015,  // Table 4
  indicators: 0.005,  // Table 5
  orderFlow:  0.005,  // Table 6 (use lower threshold like indicators)
} as const;

// Final decision tiers (from Table 7)
export const SIGNAL_TIERS = {
  CROWN:   { min: 80, label: "Crown", labelAr: "إشارة تاج" },
  STRONG:  { min: 60, label: "🟢 Strong", labelAr: "إشارة قوية" },
  WEAK:    { min: 30, label: "🟡 Weak", labelAr: "إشارة ضعيفة" },
  NONE:    { min: 0,  label: "⚪ None", labelAr: "لا إشارة" },
} as const;

// Bot entry condition (final): Confluence Score ≥ 75–80% + fundamental alignment + no high-impact news within ±30 minutes.
export const BOT_ENTRY = {
  MIN_CONFLUENCE: 75,   // %
  NEWS_BLOCK_MIN: 30,   // minutes before/after high-impact news
  MAX_RISK_PCT:   5,    // %
  MIN_RR:         3,    // 1:3 minimum
} as const;
