// Table 8 — خطة التداول والمخاطرة (37 بند)
export type TradePlanItem = {
  id: number;
  nameAr: string;
  nameEn: string;
  group: "Account" | "Risk" | "Trade" | "Levels" | "Risk-Mgmt" | "Performance" | "Reports";
  defaultOnChart?: boolean;
  formulaAr?: string;
};

export const TRADE_PLAN: TradePlanItem[] = [
  { id: 1,  nameAr: "رصيد المحفظة / رأس المال", nameEn: "Account Balance / Capital", group: "Account", formulaAr: "من حساب التداول (Exness/Capital.com)" },
  { id: 2,  nameAr: "نسبة المخاطرة", nameEn: "Risk %", group: "Risk", formulaAr: "من جدول 1 - خيارات المتداول (1-10%، 5% أقصى تنفيذي)" },
  { id: 3,  nameAr: "مبلغ المخاطرة بالدولار", nameEn: "Risk Amount ($)", group: "Risk", formulaAr: "تلقائي = رأس المال × نسبة المخاطرة" },
  { id: 4,  nameAr: "الرافعة المالية", nameEn: "Leverage", group: "Account", formulaAr: "افتراضي 1:500" },
  { id: 5,  nameAr: "حجم اللوت / العقد", nameEn: "Lot / Contract Size", group: "Trade", formulaAr: "تلقائي = مبلغ المخاطرة ÷ (SL × قيمة النقطة)" },
  { id: 6,  nameAr: "الهامش المطلوب", nameEn: "Required Margin", group: "Account", formulaAr: "حجم اللوت × سعر العقد ÷ الرافعة" },
  { id: 7,  nameAr: "الهامش المستخدم", nameEn: "Used Margin", group: "Account" },
  { id: 8,  nameAr: "الهامش المتاح", nameEn: "Free Margin", group: "Account" },
  { id: 9,  nameAr: "مستوى الهامش (%)", nameEn: "Margin Level %", group: "Account", formulaAr: "Equity ÷ Used Margin × 100" },
  { id: 10, nameAr: "تحديد السوق المالي", nameEn: "Market Selection", group: "Trade" },
  { id: 11, nameAr: "تحديد الأصل المالي", nameEn: "Asset Selection", group: "Trade", formulaAr: "من جدول 1" },
  { id: 12, nameAr: "نوع التداول (آلي / يدوي)", nameEn: "Trading Mode (Bot/Manual)", group: "Trade", formulaAr: "من جدول 1" },
  { id: 13, nameAr: "الإطار الزمني", nameEn: "Timeframe", group: "Trade", formulaAr: "من جدول 1" },
  { id: 14, nameAr: "تحديد الصفقة (شراء / بيع)", nameEn: "Direction (Buy/Sell)", group: "Trade", formulaAr: "Buy Lion / Sell Lion من جدول 7" },
  { id: 15, nameAr: "🎯 نقطة الدخول", nameEn: "Entry Price", group: "Levels", defaultOnChart: true, formulaAr: "السعر الحالي عند تأكيد القرار من جدول 7" },
  { id: 16, nameAr: "🎯 TP1 (Ratio 1:1) — 25%", nameEn: "TP1 1:1 (25%)", group: "Levels", defaultOnChart: true, formulaAr: "Entry ± (Risk × 1)" },
  { id: 17, nameAr: "🎯 TP2 (Ratio 1:2) — 50%", nameEn: "TP2 1:2 (50%)", group: "Levels", defaultOnChart: true, formulaAr: "Entry ± (Risk × 2)" },
  { id: 18, nameAr: "🎯 TP3 (Ratio 1:3) — 75%", nameEn: "TP3 1:3 (75%)", group: "Levels", defaultOnChart: true, formulaAr: "Entry ± (Risk × 3)" },
  { id: 19, nameAr: "🎯 TP4 (Ratio 1:4) — 100% Final Exit", nameEn: "TP4 1:4 Final Exit", group: "Levels", defaultOnChart: true, formulaAr: "Entry ± (Risk × 4)" },
  { id: 20, nameAr: "🛑 Stop Loss", nameEn: "Stop Loss", group: "Levels", defaultOnChart: true, formulaAr: "تلقائي بناءً على ATR + المستويات الفنية" },
  { id: 21, nameAr: "⚠️ نقاط الفخاخ وسحب السيولة (BSL/SSL)", nameEn: "Liquidity Sweep Zones (BSL/SSL)", group: "Levels", defaultOnChart: true },
  { id: 22, nameAr: "📍 Trailing Stop التلقائي", nameEn: "Trailing Stop (auto)", group: "Risk-Mgmt", defaultOnChart: true, formulaAr: "بعد TP1: SL → Breakeven, بعد TP2: SL → TP1" },
  { id: 23, nameAr: "➕ منطقة التعزيز (Pyramiding)", nameEn: "Pyramiding Zone", group: "Risk-Mgmt" },
  { id: 24, nameAr: "📊 Order Block الرئيسي", nameEn: "Main Order Block", group: "Levels" },
  { id: 25, nameAr: "📊 منطقة Supply / Demand", nameEn: "Supply/Demand Zone", group: "Levels" },
  { id: 26, nameAr: "📐 Fibonacci التصحيح (Golden Zone 0.618-0.786)", nameEn: "Fibonacci Retracement (Golden Zone)", group: "Levels", defaultOnChart: true },
  { id: 27, nameAr: "📐 Fibonacci الامتداد (1.272/1.618/2.618)", nameEn: "Fibonacci Extension", group: "Levels" },
  { id: 28, nameAr: "حساب البيب (Pip Value)", nameEn: "Pip Value", group: "Trade", formulaAr: "$10 لكل لوت قياسي للأزواج الرئيسية" },
  { id: 29, nameAr: "الربح المتوقع لكل ريشيو", nameEn: "Expected Profit per RR", group: "Performance" },
  { id: 30, nameAr: "الخسارة المحتملة", nameEn: "Potential Loss", group: "Performance" },
  { id: 31, nameAr: "Commission / Spread / Swap", nameEn: "Commission/Spread/Swap", group: "Performance" },
  { id: 32, nameAr: "الأرباح التراكمية", nameEn: "Cumulative Profit", group: "Performance" },
  { id: 33, nameAr: "معدل النجاح اليومي", nameEn: "Daily Win Rate", group: "Performance" },
  { id: 34, nameAr: "Risk:Reward الفعلي (1:3 إلزامي)", nameEn: "Effective Risk:Reward (≥1:3)", group: "Performance" },
  { id: 35, nameAr: "📑 تقييم المحفظة اليومي (PDF تلقائي)", nameEn: "Daily Portfolio Report (auto PDF)", group: "Reports" },
  { id: 36, nameAr: "📑 تقييم المحفظة الأسبوعي (PDF تلقائي)", nameEn: "Weekly Portfolio Report (auto PDF)", group: "Reports" },
  { id: 37, nameAr: "📑 تقييم المحفظة الشهري + ضرائب الأرباح (PDF تلقائي)", nameEn: "Monthly Portfolio + Profit Tax (auto PDF)", group: "Reports" },
];
