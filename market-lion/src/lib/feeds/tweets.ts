// X/Twitter tweets — fetched via free Nitter mirrors (RSS).
// Tracks: Powell (through Fed feeds), Trump (@realDonaldTrump), MBS official account,
// El-Erian, Roubini, Lyn Alden, Raoul Pal, Peter Schiff.

export type Statement = {
  id: string;
  speaker: string;
  role: string;
  text: string;
  link: string;
  pubDate: number;
  asset?: string;
  importance: "VERY_HIGH"|"HIGH"|"MEDIUM";
};

const SPEAKERS = [
  { handle: "realDonaldTrump",  speaker: "Donald J. Trump",     role: "President of the USA",       importance: "VERY_HIGH" as const, asset: "USD" },
  { handle: "elerianm",         speaker: "Mohamed El-Erian",    role: "Macro Analyst",              importance: "HIGH" as const,      asset: "USD" },
  { handle: "Nouriel",          speaker: "Nouriel Roubini",     role: "Economist",                  importance: "HIGH" as const,      asset: "USD" },
  { handle: "LynAldenContact",  speaker: "Lyn Alden",           role: "Macro Strategist",           importance: "HIGH" as const,      asset: "USD" },
  { handle: "RaoulGMI",         speaker: "Raoul Pal",           role: "Founder Real Vision",        importance: "HIGH" as const,      asset: "USD" },
  { handle: "PeterSchiff",      speaker: "Peter Schiff",        role: "CEO Euro Pacific Capital",   importance: "HIGH" as const,      asset: "XAU/USD" },
];

const NITTER_MIRRORS = [
  "https://nitter.poast.org",
  "https://nitter.privacydev.net",
  "https://nitter.net",
];

function hash(s: string): string {
  let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return String(h).replace("-","n");
}

async function fetchSpeakerTweets(handle: string, speaker: string, role: string, importance: Statement["importance"], asset: string): Promise<Statement[]> {
  for (const mirror of NITTER_MIRRORS) {
    try {
      const r = await fetch(`${mirror}/${handle}/rss`, {
        next: { revalidate: 60 },
        headers: { "user-agent": "MarketLion/3.0" },
      });
      if (!r.ok) continue;
      const xml = await r.text();
      const items = xml.split(/<item[^>]*>/i).slice(1, 11);
      const out: Statement[] = [];
      for (const it of items) {
        const title = (it.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "")
          .replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim();
        const link  = (it.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || "").trim();
        const date  = (it.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || "").trim();
        if (!title) continue;
        out.push({
          id: hash(handle + "|" + title),
          speaker, role, asset, importance,
          text: title, link,
          pubDate: date ? new Date(date).getTime() : Date.now(),
        });
      }
      if (out.length) return out;
    } catch {}
  }
  return [];
}

export async function fetchAllStatements(): Promise<Statement[]> {
  const lists = await Promise.all(SPEAKERS.map(s =>
    fetchSpeakerTweets(s.handle, s.speaker, s.role, s.importance, s.asset)));
  return lists.flat().sort((a, b) => b.pubDate - a.pubDate);
}
