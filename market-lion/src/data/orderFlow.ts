// Table 6 — تدفق الأوامر، البوك ماب، السيولة وحجم التداول — وزن 15%
import type { Tier } from "./coreTools";

export type WhaleCategory = {
  id: number;
  nameAr: string;
  nameEn: string;
  examples: string[]; // Real institutional names
};

export const WHALE_TRACKERS: WhaleCategory[] = [
  { id: 1,  nameAr: "البنوك المركزية الكبرى", nameEn: "Major Central Banks", examples: ["Federal Reserve","ECB","BoJ","BoE","PBoC","SAMA","RBA","BoC","SNB"] },
  { id: 2,  nameAr: "البنوك الاستثمارية الكبرى", nameEn: "Major Investment Banks", examples: ["Goldman Sachs","JP Morgan","Morgan Stanley","Citigroup","Deutsche Bank","UBS"] },
  { id: 3,  nameAr: "صناديق التحوط الكبرى", nameEn: "Major Hedge Funds", examples: ["Bridgewater","Renaissance","Citadel","Two Sigma","Millennium","D.E. Shaw"] },
  { id: 4,  nameAr: "شركات إدارة الأصول", nameEn: "Asset Managers", examples: ["BlackRock","Vanguard","State Street","Fidelity","PIMCO"] },
  { id: 5,  nameAr: "صناديق سيادية", nameEn: "Sovereign Wealth Funds", examples: ["PIF (KSA)","NBIM (Norway)","GIC (Singapore)","CIC (China)","ADIA (UAE)","KIA (Kuwait)"] },
  { id: 6,  nameAr: "شركات الذهب الكبرى", nameEn: "Major Gold Companies", examples: ["Newmont","Barrick Gold","Anglo Gold Ashanti","Polyus","Kinross Gold"] },
  { id: 7,  nameAr: "شركات النفط العملاقة", nameEn: "Oil Majors", examples: ["Saudi Aramco","ExxonMobil","Shell","BP","Chevron","TotalEnergies","ConocoPhillips"] },
  { id: 8,  nameAr: "صناع السوق في الفوركس", nameEn: "FX Market Makers", examples: ["Citigroup","Deutsche Bank","UBS","HSBC","Barclays","BNP Paribas","RBS"] },
  { id: 9,  nameAr: "شركات التأمين الكبرى", nameEn: "Insurance Giants", examples: ["AIG","Allianz","AXA","Munich Re","Swiss Re","Berkshire Hathaway"] },
  { id: 10, nameAr: "صناديق التقاعد الضخمة", nameEn: "Mega Pension Funds", examples: ["CalPERS","GPIF","APG","ABP","KPA Pension"] },
  { id: 11, nameAr: "صناديق ETFs ومؤشرات الذهب", nameEn: "Gold ETFs", examples: ["SPDR Gold (GLD)","iShares Gold (IAU)","GDX","GDXJ"] },
  { id: 12, nameAr: "حسابات مؤسسية كبرى (>100M$)", nameEn: "Institutional Accounts (>$100M)", examples: ["Various"] },
  { id: 13, nameAr: "كبار الأفراد (HNW > $10M)", nameEn: "HNW Individuals", examples: ["Various"] },
  { id: 14, nameAr: "خوارزميات HFT", nameEn: "HFT Firms", examples: ["Virtu","Jump","Tower"] },
  { id: 15, nameAr: "Prop Trading الكبرى", nameEn: "Major Prop Trading Firms", examples: ["Jane Street","DRW","Optiver","Hudson River Trading"] },
];

export type OrderFlowTool = {
  id: number;
  nameAr: string;
  nameEn: string;
  tier: Tier;
  descriptionAr: string;
};

export const ORDER_FLOW_TOOLS: OrderFlowTool[] = [
  { id: 1,  nameAr: "Cumulative Delta", nameEn: "Cumulative Delta", tier: "S", descriptionAr: "تجميع الدلتا (Bid×Ask) عبر الزمن لرصد التراكم/التوزيع" },
  { id: 2,  nameAr: "Footprint Chart (Bid×Ask Volume)", nameEn: "Footprint Chart", tier: "S", descriptionAr: "بصمة الحجم لكل شمعة على مستوى السعر" },
  { id: 3,  nameAr: "DOM Level 2 (Depth of Market)", nameEn: "DOM Level 2", tier: "S", descriptionAr: "عمق السوق - أوامر شراء/بيع المعلقة" },
  { id: 4,  nameAr: "Iceberg Orders Detector", nameEn: "Iceberg Detector", tier: "A", descriptionAr: "كشف الأوامر المخفية الكبيرة" },
  { id: 5,  nameAr: "Absorption Detector", nameEn: "Absorption Detector", tier: "S", descriptionAr: "رصد امتصاص السيولة عند مستويات حرجة" },
  { id: 6,  nameAr: "Stop Hunt Zones Detector", nameEn: "Stop Hunt Detector", tier: "S", descriptionAr: "مناطق الصيد لوقف الخسائر (Liquidity Sweep)" },
  { id: 7,  nameAr: "ARC Technology (Break Detection)", nameEn: "ARC Break Detection", tier: "A", descriptionAr: "كشف الكسر السعري المبكر" },
  { id: 8,  nameAr: "Bookmap BUMP/DUMP Detector", nameEn: "Bookmap BUMP/DUMP", tier: "A", descriptionAr: "كشف الإغراق والصعود المفاجئ في البوك" },
  { id: 9,  nameAr: "Liquidity Voids Detector", nameEn: "Liquidity Voids", tier: "B", descriptionAr: "فجوات السيولة (gaps in DOM)" },
  { id: 10, nameAr: "Volume Climax Detector", nameEn: "Volume Climax", tier: "A", descriptionAr: "ذروة الحجم — تنبيه للانعكاس" },
];
