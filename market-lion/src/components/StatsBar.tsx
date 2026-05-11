"use client";
import { ASSETS } from "@/data/assets";
export function StatsBar() {
  const featured = ASSETS.slice(0, 5);
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {featured.map(a => (
        <div key={a.symbol} className="gold-card p-3">
          <div className="text-xs text-gold-400">{a.symbol}</div>
          <div className="font-bold mt-0.5">— <span className="text-xs text-zinc-400 font-normal">live</span></div>
          <div className="text-xs text-green-400">▲ live feed</div>
        </div>
      ))}
    </div>
  );
}
