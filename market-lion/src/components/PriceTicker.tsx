"use client";
import { useEffect, useState } from "react";
import { ASSETS } from "@/data/assets";
import { TrendingUp, TrendingDown } from "lucide-react";

type Quote = { symbol: string; price: number; changePct: number };

/** Live price ticker bar — fetches all 9 assets every 10s from /api/prices. */
export function PriceTicker() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    let alive = true;
    async function tick() {
      try {
        const r = await fetch("/api/prices", { cache: "no-store" });
        if (r.ok && alive) {
          const j = await r.json();
          if (Array.isArray(j?.items)) setQuotes(j.items.filter((x: any) => x.price));
        }
      } catch {}
    }
    tick();
    const id = setInterval(tick, 10_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const display = quotes.length ? quotes : ASSETS.map(a => ({ symbol: a.symbol, price: 0, changePct: 0 }));

  return (
    <div className="relative overflow-hidden border-y border-gold-500/15 bg-black/85">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {[...display, ...display].map((q, i) => (
          <div key={i} className="flex items-center gap-2 px-6 text-sm">
            <span className="text-gold-400 font-bold">{q.symbol}</span>
            <span className="text-zinc-100 font-mono">{q.price ? q.price.toFixed(q.symbol.includes("JPY") ? 3 : 4) : "—"}</span>
            <span className={(q.changePct ?? 0) >= 0 ? "text-green-400" : "text-red-400"}>
              {(q.changePct ?? 0) >= 0 ? <TrendingUp size={12} className="inline"/> : <TrendingDown size={12} className="inline"/>}
              {" "}{(q.changePct ?? 0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
