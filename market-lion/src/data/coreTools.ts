// Table 3 — التحليل الفني / الأدوات الرئيسية الأساسية (23 أداة) — وزن 30%
export type Tier = "S" | "A" | "B" | "C";
export type ToolDef = {
  id: number;
  nameAr: string;
  nameEn: string;
  category: string;
  tier: Tier;
  descriptionAr: string;
  descriptionEn: string;
  defaultOnChart?: boolean;
};

export const CORE_TOOLS: ToolDef[] = [
  { id: 1,  nameAr: "هيكل السوق - القمم والقيعان (HH/HL/LH/LL, EQH, EQL)", nameEn: "Market Structure (HH/HL/LH/LL, EQH/EQL)", category: "الأصول التاريخية والبرايس أكشن", tier: "S",
    descriptionAr: "رسم القمم والقيعان الرئيسة والفرعية كنقاط ملوّنة، تحديد BOS/CHoCH وتغير الاتجاه.", descriptionEn: "Identify HH/HL/LH/LL with BOS/CHoCH detection." },
  { id: 2,  nameAr: "نقاط البيفوت (Pivot Points)", nameEn: "Pivot Points (Standard, Fibonacci, Camarilla, Woodie, DeMark)", category: "الأصول التاريخية والبرايس أكشن", tier: "S",
    descriptionAr: "حساب نقاط البيفوت بكل صيغها (Standard / Fibo / Camarilla / Woodie / DeMark) ورسم S1-S3 وR1-R3.", descriptionEn: "Compute and plot pivots with S/R levels for all five formulas." },
  { id: 3,  nameAr: "نماذج الشموع اليابانية + Price Action (حصر شامل)", nameEn: "Japanese Candlesticks + Price Action (full catalog)", category: "الأصول التاريخية والبرايس أكشن", tier: "A",
    descriptionAr: "كشف جميع نماذج الشموع: الانعكاسية (Doji, Hammer, Engulfing, Morning/Evening Star, …) والاستمرارية (Three Methods, Marubozu, …).", descriptionEn: "Full candlestick pattern detection." },
  { id: 4,  nameAr: "خطوط الدعم والمقاومة الأساسية", nameEn: "Major Support & Resistance Lines", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "A",
    descriptionAr: "اكتشاف وتعليم خطوط الدعم والمقاومة الرئيسية المتعددة الإطارات.", descriptionEn: "Multi-timeframe major S/R detection." },
  { id: 5,  nameAr: "خطوط الدعم والمقاومة الفرعية", nameEn: "Minor Support & Resistance Lines", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "B",
    descriptionAr: "خطوط الدعم والمقاومة الثانوية لأطر زمنية صغيرة.", descriptionEn: "Lower-timeframe S/R detection." },
  { id: 6,  nameAr: "خطوط الاتجاه (Trend Lines)", nameEn: "Trend Lines", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "A",
    descriptionAr: "رسم خطوط الاتجاه الصاعدة/الهابطة وتأكيد الاختراق وإعادة الاختبار.", descriptionEn: "Uptrend/downtrend trendlines with breakout & retest." },
  { id: 7,  nameAr: "SMA - متوسط بسيط 200", nameEn: "SMA 200", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "B",
    descriptionAr: "متوسط متحرك بسيط 200 — اتجاه رئيسي طويل المدى.", descriptionEn: "Long-term primary trend filter." },
  { id: 8,  nameAr: "SMA - متوسط بسيط 60", nameEn: "SMA 60", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "B",
    descriptionAr: "متوسط متحرك بسيط 60 — اتجاه متوسط المدى.", descriptionEn: "Mid-term trend reference." },
  { id: 9,  nameAr: "EMA 7 و 21 (مع التقاطع)", nameEn: "EMA 7 & 21 (with crossover)", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "A",
    descriptionAr: "متوسطات أسية سريعة — كشف التقاطع الذهبي/الموتي للمضاربة.", descriptionEn: "Fast EMA crossover signals." },
  { id: 10, nameAr: "FRAMA 126 (Fractal Adaptive MA)", nameEn: "FRAMA 126", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "B",
    descriptionAr: "متوسط فراكتلي يتكيف مع التذبذب.", descriptionEn: "Fractal adaptive moving average." },
  { id: 11, nameAr: "قناة الانحراف المعياري (Standard Deviation Channel)", nameEn: "Standard Deviation Channel", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "B",
    descriptionAr: "قناة سعرية مبنية على الانحراف المعياري لتحديد التشبع.", descriptionEn: "Std-dev based price channel." },
  { id: 12, nameAr: "قناة الانحدار الخطي (Linear Regression Channel)", nameEn: "Linear Regression Channel", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "B",
    descriptionAr: "قناة انحدار خطي لتحديد متوسط السعر العادل.", descriptionEn: "Linear regression mean & bands." },
  { id: 13, nameAr: "النماذج الفنية السعرية (حصر شامل)", nameEn: "Classical Chart Patterns (full catalog)", category: "دمج التحليل الكلاسيكي والمتوسطات", tier: "A",
    descriptionAr: "كل النماذج: الرأس والكتفين، الأوتاد، المثلثات، القاع/القمة المزدوجة، الراية، …", descriptionEn: "H&S, wedges, triangles, double tops/bottoms, flags, etc." },
  { id: 14, nameAr: "مدرسة الأموال الذكية SMC و ICT", nameEn: "Smart Money Concepts (SMC + ICT)", category: "السعر الخام والتداول المؤسسي ورصد صناع السوق", tier: "S",
    descriptionAr: "Order Blocks، BOS، CHoCH، FVG، Breaker، Mitigation، Inducement، Premium/Discount، Imbalance.", descriptionEn: "Full SMC/ICT toolkit." },
  { id: 15, nameAr: "منهجية ICT الكاملة", nameEn: "ICT Full Methodology", category: "السعر الخام والتداول المؤسسي ورصد صناع السوق", tier: "S",
    descriptionAr: "Killzones، MM Models، OTE 61.8%، Liquidity Pools، Judas Swing، Silver Bullet، Power of 3.", descriptionEn: "Killzones, OTE, Liquidity, Power of 3, etc." },
  { id: 16, nameAr: "مناطق العرض والطلب (Supply & Demand Zones)", nameEn: "Supply & Demand Zones", category: "السعر الخام والتداول المؤسسي ورصد صناع السوق", tier: "S",
    descriptionAr: "كشف مناطق العرض والطلب القوية ومراقبة استجابة السعر لها.", descriptionEn: "Detect strong supply/demand zones." },
  { id: 17, nameAr: "Order Blocks مع Volume بالدولار", nameEn: "Order Blocks (with $ Volume)", category: "السعر الخام والتداول المؤسسي ورصد صناع السوق", tier: "S",
    descriptionAr: "بلوكات الطلب المؤسسي مع حجم بالدولار وقياس قوّتها.", descriptionEn: "Institutional order blocks with USD volume." },
  { id: 18, nameAr: "Volume — حجم التداول الخام", nameEn: "Raw Volume", category: "السعر الخام والتداول المؤسسي ورصد صناع السوق", tier: "A",
    descriptionAr: "حجم التداول الكلي ومقارنته بالمتوسط لرصد التراكم/التوزيع.", descriptionEn: "Raw volume & accumulation/distribution." },
  { id: 19, nameAr: "Order Flow — تدفق الأوامر", nameEn: "Order Flow (Time & Sales + DOM + Cumulative Delta + Absorbed + Iceberg)", category: "السعر الخام والتداول المؤسسي ورصد صناع السوق", tier: "A",
    descriptionAr: "Time & Sales، DOM، Cumulative Delta، الامتصاص، Iceberg.", descriptionEn: "Tape reading + DOM + delta toolkit." },
  { id: 20, nameAr: "نظرية السيولة والفخاخ (BSL/SSL/Sweep/Stop Hunt)", nameEn: "Liquidity & Stop-hunts (BSL/SSL)", category: "السعر الخام والتداول المؤسسي ورصد صناع السوق", tier: "S",
    descriptionAr: "ICT/Wyckoff: BSL، SSL، Liquidity Sweep، Stop Hunt.", descriptionEn: "Liquidity sweeps and stop hunts." },
  { id: 21, nameAr: "تصحيح فيبوناتشي (Fibonacci Retracement)", nameEn: "Fibonacci Retracement", category: "الهندسة والرياضيات", tier: "S",
    descriptionAr: "قياسات 0.382 و 0.5 و 0.618 و 0.786 — منطقة الذهب.", descriptionEn: "Standard fib retracement levels.", defaultOnChart: true },
  { id: 22, nameAr: "امتداد فيبوناتشي (Fibonacci Extension)", nameEn: "Fibonacci Extension", category: "الهندسة والرياضيات", tier: "A",
    descriptionAr: "امتدادات 1.272، 1.618، 2.618 لإيجاد أهداف الربح.", descriptionEn: "Fib extensions for TP targeting." },
  { id: 23, nameAr: "RSI مع كشف الدايفرجنس (Regular & Hidden)", nameEn: "RSI + Divergence (Regular & Hidden)", category: "المؤشرات الفنية", tier: "A",
    descriptionAr: "مؤشر القوة النسبية مع كشف الدايفرجنس العادي والخفي.", descriptionEn: "RSI with regular & hidden divergence detection." },
];
