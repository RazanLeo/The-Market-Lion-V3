// Timeframes & weights (per master prompt, exactly):
// 1M=5, 5M=10, 15M=20, 30M=18, 1H=22, 4H=25 (sum=100)
export const TIMEFRAMES = ["1M","5M","15M","30M","1H","4H"] as const;
export type Timeframe = typeof TIMEFRAMES[number];

export const TF_WEIGHTS: Record<Timeframe, number> = {
  "1M": 5, "5M": 10, "15M": 20, "30M": 18, "1H": 22, "4H": 25,
};

// Reference (larger) timeframe map — exact from prompt
export const TF_REFERENCE: Record<Timeframe, string[]> = {
  "1M":  ["5M","15M"],
  "5M":  ["15M","30M"],
  "15M": ["30M","1H"],
  "30M": ["1H","4H"],
  "1H":  ["4H"],
  "4H":  ["1D"],
};
