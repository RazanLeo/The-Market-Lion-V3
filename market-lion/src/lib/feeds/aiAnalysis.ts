// AI-driven analysis layer.
// Uses a simple rule-based sentiment classifier for now (no paid API),
// and exposes a hook to swap in an open-source LLM (Hugging Face Inference API free tier
// or self-hosted llama.cpp) via the OPENAI_BASE_URL environment variable.
//
// For each news/indicator/statement we produce:
//   - polarity:  +1 buy / -1 sell / 0 neutral
//   - perTf:     a vote per timeframe (1M..4H)
//   - narrative: Arabic-Arabic narrative paragraph

export type Polarity = -1 | 0 | 1;

const POS_WORDS = [
  "rise","rising","jumps","gains","gained","beats","beat","strong","strongest","record high","up","upbeat","bullish",
  "surges","surged","cuts rates","easing","stimulus","stronger than expected","robust","expanded","expansion",
  "ارتفاع","ارتفع","قوي","قياسي","صعود","يقفز","يتجاوز التوقعات","خفض الفائدة","تحفيز","صعودي","تعافي",
];
const NEG_WORDS = [
  "fall","falls","drops","plunges","weak","weakens","misses","missed","worse","decline","declined","contraction",
  "recession","downturn","tightens","tightening","rate hike","unexpected hike","sanctions","layoffs","hawkish",
  "هبوط","هبط","ضعيف","يخسر","ركود","تشديد","رفع الفائدة","عقوبات","نزولي","تراجع",
];

export function classify(text: string): Polarity {
  const t = text.toLowerCase();
  let p = 0;
  for (const w of POS_WORDS) if (t.includes(w)) p += 1;
  for (const w of NEG_WORDS) if (t.includes(w)) p -= 1;
  if (p >= 1) return 1;
  if (p <= -1) return -1;
  return 0;
}

/** Translate polarity into per-timeframe votes, weighted by how immediate the news is.
 * Short timeframes react first; long timeframes only react to major events.
 */
export function votesFromPolarity(polarity: Polarity, importance: string): Record<string, Polarity> {
  if (polarity === 0) return { "1M": 0, "5M": 0, "15M": 0, "30M": 0, "1H": 0, "4H": 0 };
  const strong = importance === "VERY_HIGH" || importance === "HIGH";
  return {
    "1M":  polarity,
    "5M":  polarity,
    "15M": polarity,
    "30M": strong ? polarity : 0,
    "1H":  strong ? polarity : 0,
    "4H":  strong ? polarity : 0,
  };
}

/** Build an Arabic narrative the trader can read at a glance. */
export function narrative(title: string, source: string, polarity: Polarity, asset: string, importance: string): string {
  const dirAr = polarity > 0 ? "إيجابي (شراء)" : polarity < 0 ? "سلبي (بيع)" : "محايد";
  const impAr = importance === "VERY_HIGH" ? "عالي جدًا"
    : importance === "HIGH" ? "عالي"
    : importance === "MEDIUM" ? "متوسط" : "منخفض";
  return [
    `${title}.`,
    `المصدر: ${source}.`,
    `الأهمية: ${impAr}.`,
    `الأصل المتأثر: ${asset}.`,
    `التأثير المتوقع: ${dirAr} على الإطارات الزمنية القصيرة، خصوصًا 1M-15M.`,
    polarity !== 0
      ? `السبب: الكلمات المفتاحية في النص تشير إلى ضغط ${polarity > 0 ? "شرائي" : "بيعي"} على الأصل.`
      : `السبب: لا يوجد إشارة كلامية قوية تدل على اتجاه واضح بعد.`,
  ].join(" ");
}
