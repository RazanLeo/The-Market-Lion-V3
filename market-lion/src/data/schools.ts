// Table 4 — جميع مدارس التحليل الفني (48 مدرسة) — وزن 25%
import type { Tier } from "./coreTools";

export type SchoolDef = {
  id: number;
  nameAr: string;
  nameEn: string;
  category: string;
  tier: Tier;
};

export const SCHOOLS: SchoolDef[] = [
  { id:  1, nameAr: "نظرية داو (Dow Theory)", nameEn: "Dow Theory", category: "الكلاسيكية", tier: "A" },
  { id:  2, nameAr: "IPDA - Interbank Price Delivery Algorithm", nameEn: "IPDA", category: "السعر الخام والمؤسسي", tier: "S" },
  { id:  3, nameAr: "شوكة أندروز (Andrews Pitchfork)", nameEn: "Andrews Pitchfork", category: "الهندسة والرياضيات", tier: "B" },
  { id:  4, nameAr: "صندوق دارفاس (Darvas Box Theory)", nameEn: "Darvas Box Theory", category: "الكلاسيكية", tier: "B" },
  { id:  5, nameAr: "تحليل مراحل وينشتاين", nameEn: "Weinstein Stage Analysis", category: "الكلاسيكية", tier: "B" },
  { id:  6, nameAr: "الفراكتل ونظرية الفوضى (Bill Williams)", nameEn: "Bill Williams - Fractal & Chaos", category: "الأمواج والدورات", tier: "A" },
  { id:  7, nameAr: "نظام السلحفاة (Turtle Trading)", nameEn: "Turtle Trading", category: "تتبع الاتجاه", tier: "A" },
  { id:  8, nameAr: "موجات إليوت (Elliott Wave Theory)", nameEn: "Elliott Wave Theory", category: "الأمواج والدورات", tier: "S" },
  { id:  9, nameAr: "طريقة وايكوف (Wyckoff Method)", nameEn: "Wyckoff Method", category: "السعر الخام والمؤسسي", tier: "S" },
  { id: 10, nameAr: "دورات هيرست (Hurst Cycles)", nameEn: "Hurst Cycle Analysis", category: "الأمواج والدورات", tier: "B" },
  { id: 11, nameAr: "سلسلة دي مارك (DeMark Sequential & Combo)", nameEn: "DeMark Sequential & Combo", category: "الأنظمة الكمية", tier: "A" },
  { id: 12, nameAr: "موجة كوندراتيف (Kondratieff)", nameEn: "Kondratieff Wave", category: "الأمواج والدورات", tier: "B" },
  { id: 13, nameAr: "VSA - Volume Spread Analysis (Tom Williams)", nameEn: "Volume Spread Analysis (VSA)", category: "الحجم والتدفق", tier: "A" },
  { id: 14, nameAr: "ملف السوق (Market Profile - Steidlmayer)", nameEn: "Market Profile", category: "الحجم والتدفق", tier: "A" },
  { id: 15, nameAr: "نظرية مزاد السوق (Auction Market Theory)", nameEn: "Auction Market Theory", category: "الحجم والتدفق", tier: "A" },
  { id: 16, nameAr: "البصمة والدلتا (Footprint & Delta)", nameEn: "Footprint Charts & Delta", category: "الحجم والتدفق", tier: "S" },
  { id: 17, nameAr: "تداول المجمعات المظلمة (Dark Pools)", nameEn: "Dark Pool Trading", category: "السعر الخام والمؤسسي", tier: "A" },
  { id: 18, nameAr: "ملف الحجم الأفقي (Volume Profile / VPVR)", nameEn: "Volume Profile (VPVR/VPSR/TPO)", category: "الحجم والتدفق", tier: "S" },
  { id: 19, nameAr: "Fibonacci Fan", nameEn: "Fibonacci Fan", category: "الهندسة والرياضيات", tier: "B" },
  { id: 20, nameAr: "Fibonacci Arcs", nameEn: "Fibonacci Arcs", category: "الهندسة والرياضيات", tier: "B" },
  { id: 21, nameAr: "Fibonacci Time Zones", nameEn: "Fibonacci Time Zones", category: "الهندسة والرياضيات", tier: "B" },
  { id: 22, nameAr: "Fibonacci Speed Resistance Fan", nameEn: "Fibonacci Speed Resistance Fan", category: "الهندسة والرياضيات", tier: "B" },
  { id: 23, nameAr: "نظرية غان السعرية (Gann)", nameEn: "Gann Price Theory (Angles, Sq9)", category: "الهندسة والرياضيات", tier: "A" },
  { id: 24, nameAr: "الأنماط التوافقية (Harmonics)", nameEn: "Harmonic Patterns (Gartley/Bat/Crab/...)", category: "الهندسة والرياضيات", tier: "A" },
  { id: 25, nameAr: "الهندسة المقدسة / النسبة الذهبية", nameEn: "Sacred Geometry / Golden Ratio", category: "الهندسة والرياضيات", tier: "B" },
  { id: 26, nameAr: "Renko Charts", nameEn: "Renko Charts", category: "أنواع الشارت البديلة", tier: "B" },
  { id: 27, nameAr: "Heikin Ashi", nameEn: "Heikin Ashi", category: "أنواع الشارت البديلة", tier: "B" },
  { id: 28, nameAr: "Kagi Charts", nameEn: "Kagi Charts", category: "أنواع الشارت البديلة", tier: "B" },
  { id: 29, nameAr: "Three Line Break", nameEn: "Three Line Break", category: "أنواع الشارت البديلة", tier: "B" },
  { id: 30, nameAr: "Range Bars", nameEn: "Range Bars", category: "أنواع الشارت البديلة", tier: "B" },
  { id: 31, nameAr: "Point & Figure", nameEn: "Point & Figure", category: "أنواع الشارت البديلة", tier: "B" },
  { id: 32, nameAr: "Tick Charts", nameEn: "Tick Charts", category: "أنواع الشارت البديلة", tier: "B" },
  { id: 33, nameAr: "التداول الكمي/الخوارزمي", nameEn: "Quantitative Algo Trading", category: "الكمية الحديثة", tier: "S" },
  { id: 34, nameAr: "ارتداد للمتوسط (Mean Reversion)", nameEn: "Mean Reversion", category: "الكمية الحديثة", tier: "A" },
  { id: 35, nameAr: "التحليل بين الأسواق (Intermarket)", nameEn: "Intermarket Analysis", category: "الكمية الحديثة", tier: "A" },
  { id: 36, nameAr: "تقرير COT", nameEn: "COT Report", category: "السعر الخام والمؤسسي", tier: "A" },
  { id: 37, nameAr: "اتساع السوق (Market Breadth)", nameEn: "Market Breadth", category: "الكمية الحديثة", tier: "A" },
  { id: 38, nameAr: "AI & Machine Learning في التحليل", nameEn: "AI & ML in TA", category: "الكمية الحديثة", tier: "S" },
  { id: 39, nameAr: "الموسمية (Seasonality)", nameEn: "Seasonality", category: "التحليل الزمني", tier: "B" },
  { id: 40, nameAr: "منهجية أونيل (CANSLIM)", nameEn: "CANSLIM (W. O'Neil)", category: "الكلاسيكية", tier: "A" },
  { id: 41, nameAr: "تداول الزخم (Momentum Trading)", nameEn: "Momentum Trading", category: "تتبع الاتجاه", tier: "A" },
  { id: 42, nameAr: "القوة النسبية مانسفيلد", nameEn: "Mansfield Relative Strength", category: "الكلاسيكية", tier: "B" },
  { id: 43, nameAr: "مربع غان الزمني", nameEn: "Gann Square of Time", category: "التحليل الزمني", tier: "B" },
  { id: 44, nameAr: "نجمة غان / Hexagon", nameEn: "Gann Star / Hexagon", category: "التحليل الزمني", tier: "B" },
  { id: 45, nameAr: "التحليل الزمني الدوري (Cyclic Analysis)", nameEn: "Cyclic Analysis", category: "التحليل الزمني", tier: "B" },
  { id: 46, nameAr: "التوقيت الفلكي (Financial Astrology)", nameEn: "Financial Astrology", category: "التحليل الزمني", tier: "B" },
  { id: 47, nameAr: "تحليل جلسات الأسواق", nameEn: "Market Sessions (Sydney/Tokyo/London/NY)", category: "التحليل الزمني", tier: "A" },
  { id: 48, nameAr: "Volume Charts", nameEn: "Volume Charts", category: "الحجم والتدفق", tier: "B" },
];
