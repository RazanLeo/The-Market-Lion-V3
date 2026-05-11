"use client";
import { ASSETS } from "@/data/assets";

export function PriceTicker() {
  return (
    <div className="relative overflow-hidden border-y border-gold-500/15 bg-black/85">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {[...ASSETS, ...ASSETS].map((a, i) => (
          <div key={i} className="flex items-center gap-2 px-6 text-sm">
            <span className="text-gold-400 font-bold">{a.symbol}</span>
            <span className="text-zinc-300">{a.nameAr}</span>
            <span className="text-green-400 font-semibold">▲ live</span>
          </div>
        ))}
      </div>
    </div>
  );
}
