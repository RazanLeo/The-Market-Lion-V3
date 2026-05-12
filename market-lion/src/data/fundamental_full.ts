// Full sample roster of the 40 economic indicators (exactly as the master Excel sheet 2).
// Each row carries: # / asset / indicator / UTC time / local time / importance / source.
// 'previous/forecast/actual' values stream from the /api/fundamental endpoint at runtime.

export type EconRow = {
  id: number;
  asset: string;
  indicator: string;     // exact text from Excel
  timeUtc: string;
  timeLocal: string;
  source: string;
  importance: "HIGH" | "VERY_HIGH" | "MEDIUM" | "LOW";
};

export const ECON_FULL: EconRow[] = [
  { id: 1,  asset: "USD",     indicator: "قرار الفائدة الفيدرالية (FOMC Rate Decision)",        timeUtc: "18:00 UTC", timeLocal: "21:00 KSA", source: "Federal Reserve", importance: "VERY_HIGH" },
  { id: 2,  asset: "USD",     indicator: "Dot Plot - توقعات أعضاء الفيدرالي",                    timeUtc: "حسب الجدولة", timeLocal: "حسب الجدولة", source: "Federal Reserve", importance: "VERY_HIGH" },
  { id: 3,  asset: "USD",     indicator: "FOMC Minutes - محاضر اجتماعات الفيدرالي",              timeUtc: "شهري",       timeLocal: "شهري",         source: "Federal Reserve", importance: "HIGH" },
  { id: 4,  asset: "EUR",     indicator: "ECB - قرار الفائدة الأوروبي",                         timeUtc: "12:15 UTC", timeLocal: "15:15 KSA", source: "ECB", importance: "VERY_HIGH" },
  { id: 5,  asset: "GBP",     indicator: "BOE - بنك إنجلترا (قرار الفائدة)",                    timeUtc: "11:00 UTC", timeLocal: "14:00 KSA", source: "Bank of England", importance: "VERY_HIGH" },
  { id: 6,  asset: "JPY",     indicator: "BOJ - بنك اليابان (قرار الفائدة + YCC)",              timeUtc: "03:00 UTC", timeLocal: "06:00 KSA", source: "Bank of Japan", importance: "VERY_HIGH" },
  { id: 7,  asset: "CHF",     indicator: "SNB - البنك السويسري",                                timeUtc: "07:30 UTC", timeLocal: "10:30 KSA", source: "SNB", importance: "HIGH" },
  { id: 8,  asset: "AUD",     indicator: "RBA - البنك المركزي الأسترالي",                       timeUtc: "03:30 UTC", timeLocal: "06:30 KSA", source: "RBA", importance: "HIGH" },
  { id: 9,  asset: "CAD",     indicator: "BOC - بنك كندا (مهم للنفط)",                          timeUtc: "14:00 UTC", timeLocal: "17:00 KSA", source: "BoC", importance: "HIGH" },
  { id: 10, asset: "USD",     indicator: "DXY - مؤشر الدولار الأمريكي",                          timeUtc: "لحظي",       timeLocal: "لحظي",         source: "ICE", importance: "HIGH" },
  { id: 11, asset: "USD",     indicator: "CPI - مؤشر أسعار المستهلكين (Headline)",              timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BLS", importance: "VERY_HIGH" },
  { id: 12, asset: "USD",     indicator: "Core CPI - مؤشر أسعار المستهلكين الأساسي",            timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BLS", importance: "VERY_HIGH" },
  { id: 13, asset: "USD",     indicator: "PPI - مؤشر أسعار المنتجين",                            timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BLS", importance: "HIGH" },
  { id: 14, asset: "USD",     indicator: "PCE - نفقات الاستهلاك الشخصي (المفضل للفيد)",         timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BEA", importance: "VERY_HIGH" },
  { id: 15, asset: "USD",     indicator: "Core PCE - PCE الأساسي بدون الغذاء والطاقة",           timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BEA", importance: "VERY_HIGH" },
  { id: 16, asset: "USD",     indicator: "GDP - الناتج المحلي الإجمالي (Advance/Final)",         timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BEA", importance: "VERY_HIGH" },
  { id: 17, asset: "USD",     indicator: "GDPNow - توقع الفيدرالي أتلانتا اللحظي",                timeUtc: "لحظي",       timeLocal: "لحظي",         source: "Atlanta Fed", importance: "MEDIUM" },
  { id: 18, asset: "USD",     indicator: "Industrial Production - الإنتاج الصناعي",              timeUtc: "13:15 UTC", timeLocal: "16:15 KSA", source: "Federal Reserve", importance: "MEDIUM" },
  { id: 19, asset: "USD",     indicator: "NFP - الوظائف غير الزراعية (أهم تقرير شهري)",         timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BLS", importance: "VERY_HIGH" },
  { id: 20, asset: "USD",     indicator: "Unemployment Rate - معدل البطالة",                     timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BLS", importance: "HIGH" },
  { id: 21, asset: "USD",     indicator: "Initial Jobless Claims - طلبات إعانة البطالة الأسبوعية", timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "DoL", importance: "MEDIUM" },
  { id: 22, asset: "USD",     indicator: "JOLTS - فرص العمل + معدل الاستقالات",                  timeUtc: "14:00 UTC", timeLocal: "17:00 KSA", source: "BLS", importance: "MEDIUM" },
  { id: 23, asset: "USD",     indicator: "ADP Employment - تقرير التوظيف الخاص",                 timeUtc: "12:15 UTC", timeLocal: "15:15 KSA", source: "ADP", importance: "MEDIUM" },
  { id: 24, asset: "USD",     indicator: "Average Hourly Earnings - متوسط الأجور الساعية",       timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "BLS", importance: "HIGH" },
  { id: 25, asset: "USD",     indicator: "Retail Sales - مبيعات التجزئة (Headline + Core)",       timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "Census Bureau", importance: "HIGH" },
  { id: 26, asset: "USD",     indicator: "Consumer Confidence - ثقة المستهلك (CB)",              timeUtc: "14:00 UTC", timeLocal: "17:00 KSA", source: "Conference Board", importance: "MEDIUM" },
  { id: 27, asset: "USD",     indicator: "UoM Consumer Sentiment - ثقة المستهلك ميشيغان",        timeUtc: "14:00 UTC", timeLocal: "17:00 KSA", source: "U. of Michigan", importance: "MEDIUM" },
  { id: 28, asset: "USD",     indicator: "ISM Manufacturing PMI - مؤشر مديري المشتريات الصناعي", timeUtc: "14:00 UTC", timeLocal: "17:00 KSA", source: "ISM", importance: "HIGH" },
  { id: 29, asset: "USD",     indicator: "ISM Services PMI - مؤشر مديري المشتريات الخدمي",       timeUtc: "14:00 UTC", timeLocal: "17:00 KSA", source: "ISM", importance: "HIGH" },
  { id: 30, asset: "USD",     indicator: "S&P Global PMI - المؤشر العالمي",                       timeUtc: "13:45 UTC", timeLocal: "16:45 KSA", source: "S&P Global", importance: "HIGH" },
  { id: 31, asset: "CNY",     indicator: "Caixin PMI الصيني (مهم للسلع والنفط)",                 timeUtc: "01:45 UTC", timeLocal: "04:45 KSA", source: "Caixin", importance: "HIGH" },
  { id: 32, asset: "USD",     indicator: "Durable Goods Orders - طلبيات السلع المعمرة",          timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "Census Bureau", importance: "MEDIUM" },
  { id: 33, asset: "USD",     indicator: "Housing Starts & Building Permits",                     timeUtc: "12:30 UTC", timeLocal: "15:30 KSA", source: "Census Bureau", importance: "MEDIUM" },
  { id: 34, asset: "USD",     indicator: "Case-Shiller Home Price Index",                         timeUtc: "13:00 UTC", timeLocal: "16:00 KSA", source: "S&P", importance: "LOW" },
  { id: 35, asset: "USD",     indicator: "US Treasury Yields - عوائد السندات (2Y, 10Y, 30Y)",     timeUtc: "لحظي",       timeLocal: "لحظي",         source: "US Treasury", importance: "HIGH" },
  { id: 36, asset: "USD",     indicator: "Real Yields TIPS 10Y - العائد الحقيقي (الأهم للذهب)",    timeUtc: "لحظي",       timeLocal: "لحظي",         source: "US Treasury", importance: "HIGH" },
  { id: 37, asset: "XTI/USD", indicator: "EIA Crude Oil Inventories - مخزونات النفط الأسبوعية",  timeUtc: "14:30 UTC", timeLocal: "17:30 KSA", source: "EIA", importance: "HIGH" },
  { id: 38, asset: "XTI/USD", indicator: "API Crude Oil Inventories - تقرير API",                timeUtc: "20:30 UTC", timeLocal: "23:30 KSA", source: "API", importance: "MEDIUM" },
  { id: 39, asset: "XTI/USD", indicator: "Baker Hughes Rig Count - عدد منصات الحفر",             timeUtc: "الجمعة 17:00", timeLocal: "الجمعة 20:00", source: "Baker Hughes", importance: "MEDIUM" },
  { id: 40, asset: "XAU/USD", indicator: "COMEX Gold Positioning - مراكز المضاربين",             timeUtc: "الجمعة 19:30", timeLocal: "الجمعة 22:30", source: "CFTC", importance: "HIGH" },
];

// 12 news/report rows (section 2).
export type NewsRow = {
  id: number;
  asset: string;
  story: string;
  period: string;
  timeUtc: string;
  timeLocal: string;
  source: string;
  importance: "VERY_HIGH"|"HIGH"|"MEDIUM"|"LOW";
};

export const NEWS_FULL: NewsRow[] = [
  { id: 1,  asset: "XAU/USD", story: "تقرير مجلس الذهب العالمي (WGC) ربعي",             period: "ربعي",   timeUtc: "حسب الإصدار", timeLocal: "حسب الإصدار", source: "World Gold Council", importance: "HIGH" },
  { id: 2,  asset: "XAU/USD", story: "تقرير صندوق النقد الدولي للذهب",                   period: "دوري",   timeUtc: "حسب الإصدار", timeLocal: "حسب الإصدار", source: "IMF",                importance: "HIGH" },
  { id: 3,  asset: "USD",     story: "تقرير الخزانة الأمريكية الفصلي",                   period: "ربعي",   timeUtc: "15:00 UTC",  timeLocal: "18:00 KSA",  source: "US Treasury",        importance: "HIGH" },
  { id: 4,  asset: "XTI/USD", story: "تقرير OPEC الشهري (MOMR)",                          period: "شهري",   timeUtc: "12:00 UTC",  timeLocal: "15:00 KSA",  source: "OPEC",               importance: "VERY_HIGH" },
  { id: 5,  asset: "XTI/USD", story: "تقرير وكالة الطاقة الدولية (IEA) الشهري",           period: "شهري",   timeUtc: "08:00 UTC",  timeLocal: "11:00 KSA",  source: "IEA",                importance: "HIGH" },
  { id: 6,  asset: "XTI/USD", story: "EIA Short-Term Energy Outlook (STEO)",              period: "شهري",   timeUtc: "17:00 UTC",  timeLocal: "20:00 KSA",  source: "EIA",                importance: "HIGH" },
  { id: 7,  asset: "USD",     story: "الأخبار الجيوسياسية المؤثرة (حروب/عقوبات)",         period: "لحظي",   timeUtc: "لحظي",       timeLocal: "لحظي",        source: "Reuters/Bloomberg",  importance: "VERY_HIGH" },
  { id: 8,  asset: "USD",     story: "COT Report - تقرير صفقات المضاربين",                period: "أسبوعي", timeUtc: "الجمعة 19:30", timeLocal: "الجمعة 22:30", source: "CFTC",             importance: "HIGH" },
  { id: 9,  asset: "USD",     story: "تقارير CPI/PPI الأوروبية والآسيوية",                period: "شهري",   timeUtc: "حسب الدولة", timeLocal: "حسب الدولة", source: "Central Banks",       importance: "HIGH" },
  { id: 10, asset: "XAU/USD", story: "تقارير LBMA Gold Price (London Fix)",               period: "يومي",   timeUtc: "10:30 + 15:00 UTC", timeLocal: "13:30 + 18:00 KSA", source: "LBMA",      importance: "MEDIUM" },
  { id: 11, asset: "XAU/USD", story: "Gold ETF Flows (GLD, IAU, SPDR)",                    period: "يومي",   timeUtc: "بعد إغلاق NY", timeLocal: "بعد إغلاق NY", source: "WGC/ETF Providers",   importance: "MEDIUM" },
  { id: 12, asset: "USD",     story: "Mining Stocks Performance (GDX, GDXJ)",              period: "لحظي",   timeUtc: "لحظي",       timeLocal: "لحظي",        source: "NYSE",                importance: "MEDIUM" },
];

// 12 statements/speakers rows (section 3).
export type StmtRow = {
  id: number;
  asset: string;
  event: string;
  period: string;
  timeUtc: string;
  speaker: string;
  channel: string;
  importance: "VERY_HIGH"|"HIGH"|"MEDIUM";
};

export const STMT_FULL: StmtRow[] = [
  { id: 1,  asset: "USD",     event: "خطاب رئيس الفيدرالي + Press Conference",                  period: "حسب الجدولة", timeUtc: "18:30 UTC", speaker: "Jerome Powell",      channel: "Federal Reserve",                       importance: "VERY_HIGH" },
  { id: 2,  asset: "EUR",     event: "خطاب رئيس البنك المركزي الأوروبي + Press Conference",     period: "حسب الجدولة", timeUtc: "12:45 UTC", speaker: "Christine Lagarde",  channel: "ECB",                                   importance: "VERY_HIGH" },
  { id: 3,  asset: "GBP",     event: "خطاب محافظ بنك إنجلترا",                                  period: "حسب الجدولة", timeUtc: "حسب الجدولة", speaker: "BoE Governor",       channel: "Bank of England",                       importance: "HIGH" },
  { id: 4,  asset: "JPY",     event: "خطاب محافظ بنك اليابان",                                  period: "حسب الجدولة", timeUtc: "حسب الجدولة", speaker: "BoJ Governor",       channel: "Bank of Japan",                         importance: "HIGH" },
  { id: 5,  asset: "USD",     event: "خطابات الرئيس الأمريكي + تغريداته",                       period: "لحظي",        timeUtc: "لحظي",        speaker: "Donald Trump",        channel: "Twitter/X (@realDonaldTrump)",         importance: "VERY_HIGH" },
  { id: 6,  asset: "XAU/USD", event: "تصريحات ولي العهد السعودي",                                period: "لحظي",        timeUtc: "لحظي",        speaker: "محمد بن سلمان",       channel: "الحساب الرسمي للقيادة السعودية",        importance: "VERY_HIGH" },
  { id: 7,  asset: "USD",     event: "تغريدات وزير الخزانة الأمريكي",                            period: "لحظي",        timeUtc: "لحظي",        speaker: "US Treasury Secretary", channel: "Twitter/X",                            importance: "HIGH" },
  { id: 8,  asset: "XTI/USD", event: "تصريحات وزراء طاقة OPEC+ (السعودية، الإمارات، روسيا، إيران)", period: "لحظي",     timeUtc: "لحظي",        speaker: "OPEC+ Energy Ministers", channel: "بيانات رسمية + Twitter",              importance: "VERY_HIGH" },
  { id: 9,  asset: "USD",     event: "تغريدات Macro Analysts المؤثرين",                          period: "لحظي",        timeUtc: "لحظي",        speaker: "El-Erian, Roubini, Lyn Alden, Raoul Pal", channel: "Twitter/X",            importance: "MEDIUM" },
  { id: 10, asset: "USD",     event: "تصريحات CEOs الكبار",                                      period: "لحظي",        timeUtc: "لحظي",        speaker: "Larry Fink (BlackRock), Jamie Dimon (JPM)", channel: "CNBC + Bloomberg + Twitter", importance: "HIGH" },
  { id: 11, asset: "USD",     event: "خطابات أعضاء FOMC الأفراد (Hawkish/Dovish)",               period: "شبه يومي",    timeUtc: "متغير",       speaker: "FOMC Members",       channel: "Federal Reserve",                      importance: "HIGH" },
  { id: 12, asset: "CNY",     event: "تصريحات البنك المركزي الصيني (PBOC)",                       period: "شبه يومي",    timeUtc: "متغير",       speaker: "PBOC Governor",      channel: "China Central Bank",                   importance: "HIGH" },
];
