// 9 assets accepted by the platform — exactly as listed in the master prompt.
export type Asset = {
  symbol: string;        // e.g. XAU/USD
  base: string;          // e.g. XAU
  quote: string;         // e.g. USD
  yahoo: string;         // Yahoo Finance ticker for free price feed
  pipValuePerLot: number; // USD per pip per 1 standard lot (approx)
  nameAr: string;
  nameEn: string;
};

export const ASSETS: Asset[] = [
  { symbol: "XAU/USD", base: "XAU", quote: "USD", yahoo: "GC=F", pipValuePerLot: 10, nameAr: "الذهب", nameEn: "Gold" },
  { symbol: "XTI/USD", base: "XTI", quote: "USD", yahoo: "CL=F", pipValuePerLot: 10, nameAr: "نفط WTI", nameEn: "WTI Oil" },
  { symbol: "EUR/USD", base: "EUR", quote: "USD", yahoo: "EURUSD=X", pipValuePerLot: 10, nameAr: "يورو/دولار", nameEn: "EUR/USD" },
  { symbol: "GBP/USD", base: "GBP", quote: "USD", yahoo: "GBPUSD=X", pipValuePerLot: 10, nameAr: "إسترليني/دولار", nameEn: "GBP/USD" },
  { symbol: "USD/JPY", base: "USD", quote: "JPY", yahoo: "JPY=X",   pipValuePerLot: 9.1, nameAr: "دولار/ين", nameEn: "USD/JPY" },
  { symbol: "USD/CHF", base: "USD", quote: "CHF", yahoo: "CHF=X",   pipValuePerLot: 11.2, nameAr: "دولار/فرنك", nameEn: "USD/CHF" },
  { symbol: "USD/CAD", base: "USD", quote: "CAD", yahoo: "CAD=X",   pipValuePerLot: 7.4, nameAr: "دولار/كندي", nameEn: "USD/CAD" },
  { symbol: "AUD/USD", base: "AUD", quote: "USD", yahoo: "AUDUSD=X",pipValuePerLot: 10, nameAr: "أسترالي/دولار", nameEn: "AUD/USD" },
  { symbol: "NZD/USD", base: "NZD", quote: "USD", yahoo: "NZDUSD=X",pipValuePerLot: 10, nameAr: "نيوزلندي/دولار", nameEn: "NZD/USD" },
];
