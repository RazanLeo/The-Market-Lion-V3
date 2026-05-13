"use client";
import { useEffect, useState } from "react";
import { ASSETS } from "@/data/assets";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Quote = { symbol: string; price?: number; changePct?: number; ts?: number };

/** Live price ticker bar — fetches all 9 assets every 10s from /api/prices.
 *  KEEPS last-known price per asset so partial Yahoo rate-limits don't blank the bar. */
export function PriceTicker() {
  const [quotes, setQuotes] = useState<Record<string, Quote>>(() => {
    // Initial state: try to load last cache from localStorage
    if (typeof window === "undefined") return {};
    try {
      const cached = localStorage.getItem("ml.priceCache");
      return cached ? JSON.parse(cached) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    let alive = true;
    async function tick() {
      try {
        const r = await fetch("/api/prices", { cache: "no-store" });
        if (r.ok && alive) {
          const j = await r.json();
          if (Array.isArray(j?.items)) {
            setQuotes(prev => {
              const next = { ...prev };
              for (const item of j.items) {
                if (item.symbol && typeof item.price === "number" && item.price > 0) {
                  next[item.symbol] = { symbol: item.symbol, price: item.price, changePct: item.changePct ?? 0, ts: item.ts };
                }
                // else: keep previous cached value (don't overwrite with empty)
              }
              try { localStorage.setItem("ml.priceCache", JSON.stringify(next)); } catch {}
              return next;
            });
          }
        }
      } catch {}
    }
    tick();
    const id = setInterval(tick, 10_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  // Always render all 9 assets in their fixed order
  const display = ASSETS.map(a => quotes[a.symbol] || { symbol: a.symbol });

  return (
    <div className="relative overflow-hidden border-y border-gold-500/15 bg-black/85">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {[...display, ...display].map((q, i) => {
          const hasPrice = typeof q.price === "number" && q.price > 0;
          const pct = q.changePct ?? 0;
          const Icon = !hasPrice ? Minus : pct >= 0 ? TrendingUp : TrendingDown;
          const color = !hasPrice ? "text-zinc-500" : pct >= 0 ? "text-green-400" : "text-red-400";
          const priceStr = hasPrice
            ? q.price!.toFixed(q.symbol.includes("JPY") ? 3 : q.symbol.startsWith("XAU") || q.symbol.startsWith("XTI") ? 2 : 4)
            : "...";
          return (
            <div key={i} className="flex items-center gap-2 px-6 text-sm">
              <span className="text-gold-400 font-bold">{q.symbol}</span>
              <span className="text-zinc-100 font-mono">{priceStr}</span>
              <span className={color}>
                <Icon size={12} className="inline"/>
                {hasPrice ? ` ${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : " ..."}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
