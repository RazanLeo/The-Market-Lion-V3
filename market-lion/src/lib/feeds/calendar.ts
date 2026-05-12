// Economic calendar — scrape ForexFactory's public calendar JSON.
// FF publishes a free unauthenticated JSON for the week's calendar.
export type CalEvent = {
  id: string;
  date: string;        // ISO
  asset: string;       // currency code
  indicator: string;
  importance: "HIGH"|"MEDIUM"|"LOW";
  previous?: string | null;
  forecast?: string | null;
  actual?: string | null;
  source: string;
};

const URLS = [
  // ForexFactory weekly JSON (free, no API key)
  "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
];

function impFromFF(impact: string): CalEvent["importance"] {
  const t = impact.toLowerCase();
  if (t.includes("high") || t.includes("red")) return "HIGH";
  if (t.includes("medium") || t.includes("orange") || t.includes("yellow")) return "MEDIUM";
  return "LOW";
}

export async function fetchEconomicCalendar(): Promise<CalEvent[]> {
  for (const url of URLS) {
    try {
      const r = await fetch(url, { next: { revalidate: 60 } });
      if (!r.ok) continue;
      const data = await r.json();
      // Format: [{title, country, date, impact, forecast, previous, ...}]
      return (data || []).map((e: any, i: number) => ({
        id: `ff_${e.country}_${e.date}_${i}`,
        date: e.date,
        asset: e.country || e.currency || "USD",
        indicator: e.title || e.event || "Indicator",
        importance: impFromFF(e.impact || ""),
        previous: e.previous ?? null,
        forecast: e.forecast ?? null,
        actual: e.actual ?? null,
        source: "ForexFactory",
      }));
    } catch {}
  }
  return [];
}
