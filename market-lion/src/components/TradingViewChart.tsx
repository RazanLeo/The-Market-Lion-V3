"use client";
import { useEffect, useRef } from "react";

const TV_SYMBOL: Record<string, string> = {
  "XAU/USD": "OANDA:XAUUSD", "XTI/USD": "TVC:USOIL",
  "EUR/USD": "FX:EURUSD",  "GBP/USD": "FX:GBPUSD", "USD/JPY": "FX:USDJPY",
  "USD/CHF": "FX:USDCHF",  "USD/CAD": "FX:USDCAD",
  "AUD/USD": "FX:AUDUSD",  "NZD/USD": "FX:NZDUSD",
};
const TV_INTERVAL: Record<string, string> = {
  "1M":"1","5M":"5","15M":"15","30M":"30","1H":"60","4H":"240",
};

/** Full-bleed TradingView Advanced Chart banner. Renders the chart EXACTLY as if you opened tradingview.com. */
export function TradingViewChart({ symbol = "XAU/USD", interval = "15M", height = 800 }:
  { symbol?: string; interval?: string; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    el.innerHTML = "";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%"; widget.style.width = "100%";
    el.appendChild(widget);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: TV_SYMBOL[symbol] || TV_SYMBOL["XAU/USD"],
      interval: TV_INTERVAL[interval] || "15",
      timezone: "Asia/Riyadh",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#0A0A0A",
      gridColor: "rgba(174,145,83,0.07)",
      toolbar_bg: "#0A0A0A",
      enable_publishing: false,
      allow_symbol_change: true,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      withdateranges: true,
      details: true,
      hotlist: true,
      calendar: true,
      autosize: true,
      studies: ["STD;EMA","MASimple@tv-basicstudies","Volume@tv-basicstudies","RSI@tv-basicstudies","BB@tv-basicstudies"],
      support_host: "https://www.tradingview.com",
    });
    el.appendChild(script);
    return () => { if (el) el.innerHTML = ""; };
  }, [symbol, interval]);

  // Full-bleed: NO outer card padding, NO border that eats height; banner uses full container width.
  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container w-full"
      style={{ height, minHeight: height, background: "#0A0A0A", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(174,145,83,0.30)" }}
    />
  );
}
