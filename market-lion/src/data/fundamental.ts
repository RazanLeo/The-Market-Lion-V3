// Table 2 — التحليل الأساسي والتقويم الاقتصادي — وزن 20%
// Three internal sections per master prompt: indicators, news, statements/tweets

export type EconIndicator = {
  id: number;
  asset: string;             // e.g. USD, EUR, XAU
  nameAr: string;
  nameEn: string;
  importance: "HIGH" | "MEDIUM" | "LOW";
  source: string;
};

// Sample of 100+ economic indicators tracked (the live feed will fetch full set).
export const ECON_INDICATORS: EconIndicator[] = [
  { id: 1,  asset: "USD", nameAr: "قرار الفائدة الأمريكية (FOMC)", nameEn: "FOMC Interest Rate Decision", importance: "HIGH", source: "Federal Reserve" },
  { id: 2,  asset: "USD", nameAr: "كشف رواتب القطاع غير الزراعي (NFP)", nameEn: "Non-Farm Payrolls", importance: "HIGH", source: "BLS" },
  { id: 3,  asset: "USD", nameAr: "معدل التضخم (CPI)", nameEn: "CPI", importance: "HIGH", source: "BLS" },
  { id: 4,  asset: "USD", nameAr: "تضخم المنتجين (PPI)", nameEn: "PPI", importance: "HIGH", source: "BLS" },
  { id: 5,  asset: "USD", nameAr: "الناتج المحلي (GDP)", nameEn: "GDP", importance: "HIGH", source: "BEA" },
  { id: 6,  asset: "USD", nameAr: "مبيعات التجزئة", nameEn: "Retail Sales", importance: "HIGH", source: "Census Bureau" },
  { id: 7,  asset: "USD", nameAr: "مؤشر مديري المشتريات (PMI)", nameEn: "ISM/PMI", importance: "HIGH", source: "ISM" },
  { id: 8,  asset: "USD", nameAr: "ثقة المستهلك", nameEn: "Consumer Confidence", importance: "MEDIUM", source: "Conference Board" },
  { id: 9,  asset: "USD", nameAr: "طلبات إعانة البطالة", nameEn: "Initial Jobless Claims", importance: "MEDIUM", source: "DoL" },
  { id: 10, asset: "USD", nameAr: "مخزونات النفط الأمريكية (EIA)", nameEn: "EIA Crude Oil Inventories", importance: "HIGH", source: "EIA" },

  { id: 11, asset: "EUR", nameAr: "قرار الفائدة (ECB)", nameEn: "ECB Interest Rate Decision", importance: "HIGH", source: "ECB" },
  { id: 12, asset: "EUR", nameAr: "تضخم منطقة اليورو (CPI)", nameEn: "Eurozone CPI", importance: "HIGH", source: "Eurostat" },
  { id: 13, asset: "EUR", nameAr: "PMI لمنطقة اليورو", nameEn: "Eurozone PMI", importance: "HIGH", source: "S&P Global" },
  { id: 14, asset: "EUR", nameAr: "الناتج المحلي لمنطقة اليورو", nameEn: "Eurozone GDP", importance: "HIGH", source: "Eurostat" },

  { id: 15, asset: "GBP", nameAr: "قرار الفائدة البريطاني (BoE)", nameEn: "BoE Interest Rate", importance: "HIGH", source: "Bank of England" },
  { id: 16, asset: "GBP", nameAr: "تضخم بريطانيا (CPI)", nameEn: "UK CPI", importance: "HIGH", source: "ONS" },
  { id: 17, asset: "GBP", nameAr: "PMI بريطاني", nameEn: "UK PMI", importance: "HIGH", source: "S&P Global" },

  { id: 18, asset: "JPY", nameAr: "قرار الفائدة الياباني (BoJ)", nameEn: "BoJ Interest Rate", importance: "HIGH", source: "Bank of Japan" },
  { id: 19, asset: "JPY", nameAr: "تضخم اليابان", nameEn: "Japan CPI", importance: "HIGH", source: "Statistics Japan" },

  { id: 20, asset: "CHF", nameAr: "قرار الفائدة (SNB)", nameEn: "SNB Interest Rate", importance: "HIGH", source: "Swiss National Bank" },
  { id: 21, asset: "CAD", nameAr: "قرار الفائدة الكندي (BoC)", nameEn: "BoC Interest Rate", importance: "HIGH", source: "Bank of Canada" },
  { id: 22, asset: "CAD", nameAr: "تضخم كندا", nameEn: "Canada CPI", importance: "HIGH", source: "Statistics Canada" },

  { id: 23, asset: "AUD", nameAr: "قرار الفائدة (RBA)", nameEn: "RBA Interest Rate", importance: "HIGH", source: "Reserve Bank of Australia" },
  { id: 24, asset: "NZD", nameAr: "قرار الفائدة (RBNZ)", nameEn: "RBNZ Interest Rate", importance: "HIGH", source: "Reserve Bank of New Zealand" },

  { id: 25, asset: "XAU", nameAr: "احتياطيات الذهب العالمية (WGC)", nameEn: "Global Gold Reserves (WGC)", importance: "HIGH", source: "World Gold Council" },
  { id: 26, asset: "XAU", nameAr: "تقرير COT للذهب (CFTC)", nameEn: "CFTC Gold COT", importance: "MEDIUM", source: "CFTC" },
  { id: 27, asset: "XAU", nameAr: "بيانات LBMA للذهب", nameEn: "LBMA Gold Price", importance: "MEDIUM", source: "LBMA" },

  { id: 28, asset: "XTI", nameAr: "OPEC+ MOMR", nameEn: "OPEC+ Monthly Report", importance: "HIGH", source: "OPEC" },
  { id: 29, asset: "XTI", nameAr: "IEA OMR", nameEn: "IEA Oil Market Report", importance: "HIGH", source: "IEA" },
  { id: 30, asset: "XTI", nameAr: "EIA STEO", nameEn: "EIA Short-Term Outlook", importance: "HIGH", source: "EIA" },
  { id: 31, asset: "XTI", nameAr: "Baker Hughes Rig Count", nameEn: "Baker Hughes Rig Count", importance: "MEDIUM", source: "Baker Hughes" },

  { id: 32, asset: "USD", nameAr: "ميزان التجارة الأمريكي", nameEn: "US Trade Balance", importance: "MEDIUM", source: "BEA" },
  { id: 33, asset: "USD", nameAr: "الإنتاج الصناعي", nameEn: "Industrial Production", importance: "MEDIUM", source: "Federal Reserve" },
  { id: 34, asset: "USD", nameAr: "بدء بناء المنازل", nameEn: "Housing Starts", importance: "MEDIUM", source: "Census Bureau" },
  { id: 35, asset: "USD", nameAr: "مبيعات المنازل القائمة", nameEn: "Existing Home Sales", importance: "MEDIUM", source: "NAR" },
  { id: 36, asset: "USD", nameAr: "مؤشر ميشيغان لثقة المستهلك", nameEn: "Michigan Consumer Sentiment", importance: "MEDIUM", source: "U. of Michigan" },
  { id: 37, asset: "USD", nameAr: "محاضر FOMC", nameEn: "FOMC Minutes", importance: "HIGH", source: "Federal Reserve" },
  { id: 38, asset: "USD", nameAr: "مؤشر السلع الرأسمالية الأساسية", nameEn: "Core Durable Goods", importance: "MEDIUM", source: "Census Bureau" },
  { id: 39, asset: "USD", nameAr: "PCE الأساسي", nameEn: "Core PCE", importance: "HIGH", source: "BEA" },
  { id: 40, asset: "USD", nameAr: "ثقة المستهلك (CB)", nameEn: "Consumer Confidence (CB)", importance: "MEDIUM", source: "Conference Board" },
];

export type NewsItem = {
  id: number;
  asset: string;
  source: string;
  importance: "HIGH" | "MEDIUM" | "LOW";
  titleAr: string;
  titleEn: string;
};

export const NEWS_SOURCES = ["Reuters", "Bloomberg", "CNBC", "WGC", "OPEC", "IEA", "EIA", "LBMA", "Federal Reserve", "ECB"] as const;

export type SpeakerStatement = {
  id: number;
  speaker: string;
  role: string;
  channel: "Speech" | "Press" | "X" | "Interview";
};

export const TRACKED_SPEAKERS: SpeakerStatement[] = [
  { id: 1, speaker: "Jerome Powell", role: "Federal Reserve Chair", channel: "Speech" },
  { id: 2, speaker: "Christine Lagarde", role: "ECB President", channel: "Speech" },
  { id: 3, speaker: "Andrew Bailey", role: "BoE Governor", channel: "Speech" },
  { id: 4, speaker: "Kazuo Ueda", role: "BoJ Governor", channel: "Speech" },
  { id: 5, speaker: "Donald J. Trump", role: "President of the United States", channel: "X" },
  { id: 6, speaker: "Mohammed bin Salman", role: "Crown Prince of Saudi Arabia", channel: "Press" },
  { id: 7, speaker: "US Treasury Secretary", role: "US Treasury", channel: "Press" },
  { id: 8, speaker: "OPEC+ Energy Ministers", role: "OPEC+", channel: "Press" },
  { id: 9, speaker: "Mohamed El-Erian", role: "Macro Analyst", channel: "X" },
  { id: 10, speaker: "Nouriel Roubini", role: "Macro Analyst", channel: "X" },
  { id: 11, speaker: "Lyn Alden", role: "Macro Analyst", channel: "X" },
  { id: 12, speaker: "Raoul Pal", role: "Real Vision CEO", channel: "X" },
  { id: 13, speaker: "Peter Schiff", role: "Macro Analyst", channel: "X" },
  { id: 14, speaker: "Larry Fink", role: "BlackRock CEO", channel: "Interview" },
  { id: 15, speaker: "Jamie Dimon", role: "JPMorgan CEO", channel: "Interview" },
  { id: 16, speaker: "Warren Buffett", role: "Berkshire Hathaway", channel: "Interview" },
];
