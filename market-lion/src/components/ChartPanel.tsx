"use client";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function ChartPanel({ symbol = "XAU/USD" }: { symbol?: string }) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    // Use lightweight-charts dynamically (avoids SSR issues).
    let cleanup: any;
    (async () => {
      const lib = await import("lightweight-charts");
      const chart = lib.createChart(containerRef.current!, {
        layout: { background: { color: "#0A0A0A" } as any, textColor: "#D4AF37" },
        grid:   { vertLines: { color: "#1f1f1f" }, horzLines: { color: "#1f1f1f" } },
        rightPriceScale: { borderColor: "#1f1f1f" },
        timeScale: { borderColor: "#1f1f1f" },
        autoSize: true,
      });
      const candle = (chart as any).addCandlestickSeries({
        upColor: "#16A34A", downColor: "#DC2626",
        wickUpColor: "#16A34A", wickDownColor: "#DC2626",
        borderVisible: false,
      });
      // Generate synthetic candle data so the chart renders without external connection.
      const data = []; let p = 2000;
      const now = Math.floor(Date.now() / 1000) - 200 * 60;
      for (let i = 0; i < 200; i++) {
        const r = (Math.sin(i / 7) + Math.cos(i / 11)) * 0.5 + (Math.random() - 0.5) * 1.5;
        const o = p; const c = p + r; const h = Math.max(o, c) + Math.random() * 1.5; const l = Math.min(o, c) - Math.random() * 1.5;
        data.push({ time: now + i * 60, open: o, high: h, low: l, close: c });
        p = c;
      }
      candle.setData(data);
      cleanup = () => chart.remove();
    })();
    return () => cleanup && cleanup();
  }, [symbol]);
  return (
    <div className="gold-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold-400 font-bold">{t("chart.title")} {symbol} — {t("chart.live")}</h3>
        <div className="text-xs text-zinc-400">{t("chart.subtitle")}</div>
      </div>
      <div ref={containerRef} className="h-[400px] w-full"></div>
    </div>
  );
}
