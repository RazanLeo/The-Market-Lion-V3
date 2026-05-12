"use client";
import { useEffect, useRef } from "react";

const TV_SYMBOL: Record<string, string> = {
  "XAU/USD": "OANDA:XAUUSD",
  "XTI/USD": "TVC:USOIL",
  "EUR/USD": "FX:EURUSD",
  "GBP/USD": "FX:GBPUSD",
  "USD/JPY": "FX:USDJPY",
  "USD/CHF": "FX:USDCHF",
  "USD/CAD": "FX:USDCAD",
  "AUD/USD": "FX:AUDUSD",
  "NZD/USD": "FX:NZDUSD",
};

const TV_INTERVAL: Record<string, string> = {
  "1M":"1","5M":"5","15M":"15","30M":"30","1H":"60","4H":"240",
};

/**
 * TradingViewChart — uses the official Advanced Chart Widget (free, embeddable).
 * It renders a real, live TradingView chart, exactly like opening tradingview.com.
 */
export function TradingViewChart({ symbol = "XAU/USD", interval = "15M", height = 520 }:
  { symbol?: string; interval?: string; height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    const div = document.createElement("div");
    div.className = "tradingview-widget-container__widget";
    div.style.height = "100%";
    containerRef.current.appendChild(div);

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
      backgroundColor: "rgba(10,10,10,1)",
      gridColor: "rgba(212,175,55,0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      enable_publishing: false,
      allow_symbol_change: true,
      autosize: true,
      studies: [
        "STD;EMA",
        "MASimple@tv-basicstudies",
        "Volume@tv-basicstudies",
        "RSI@tv-basicstudies",
      ],
      support_host: "https://www.tradingview.com"
    });
    containerRef.current.appendChild(script);

    return () => { if (containerRef.current) containerRef.current.innerHTML = ""; };
  }, [symbol, interval]);

  return (
    <div className="gold-card p-2">
      <div ref={containerRef} className="tradingview-widget-container" style={{ height, width: "100%" }}>
      </div>
      <div className="px-3 py-1.5 text-[10px] text-zinc-500 text-center">
        Powered by TradingView • Real-time chart
      </div>
    </div>
  );
}
