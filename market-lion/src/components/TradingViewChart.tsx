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
  "1M": "1", "5M": "5", "15M": "15", "30M": "30", "1H": "60", "4H": "240",
};

// Default studies: EMA, Volume, RSI, Bollinger Bands, MACD
const DEFAULT_STUDIES = [
  "STD;EMA",
  "Volume@tv-basicstudies",
  "RSI@tv-basicstudies",
  "BB@tv-basicstudies",
  "MACD@tv-basicstudies",
];

export function TradingViewChart({
  symbol = "XAU/USD",
  interval = "15M",
  height = 800,
}: {
  symbol?: string;
  interval?: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tvSym = TV_SYMBOL[symbol] || TV_SYMBOL["XAU/USD"];
  const tvInt = TV_INTERVAL[interval] || "15";

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (!(window as any).TradingView || !containerRef.current) return;
      new (window as any).TradingView.widget({
        container_id: "ml-tv-chart",
        symbol: tvSym,
        interval: tvInt,
        timezone: "Asia/Riyadh",
        theme: "dark",
        style: "1",          // Candlestick
        locale: "ar",
        toolbar_bg: "#0A0A0A",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        save_image: true,
        height,
        width: "100%",
        withdateranges: true,
        hide_top_toolbar: false,
        studies: DEFAULT_STUDIES,
        overrides: {
          "mainSeriesProperties.candleStyle.upColor":     "#22c55e",
          "mainSeriesProperties.candleStyle.downColor":   "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor":   "#22c55e",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor":     "#22c55e",
          "mainSeriesProperties.candleStyle.wickDownColor":   "#ef4444",
          "paneProperties.background":                    "#0A0A0A",
          "paneProperties.backgroundType":                "solid",
          "paneProperties.gridProperties.color":          "#1a1a1a",
          "scalesProperties.textColor":                   "#A1A1AA",
        },
        studies_overrides: {
          "volume.volume.color.0":  "#ef4444",
          "volume.volume.color.1":  "#22c55e",
        },
      });
    };

    const wrapper = document.createElement("div");
    wrapper.id = "ml-tv-chart";
    wrapper.style.cssText = "width:100%;height:100%";
    containerRef.current.appendChild(wrapper);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [tvSym, tvInt, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        border: "1px solid rgba(174,145,83,0.30)",
        background: "#0A0A0A",
        display: "block",
        overflow: "hidden",
      }}
    />
  );
}
