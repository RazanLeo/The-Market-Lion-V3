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
    (window as any).mlTVWidget = null;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (!(window as any).TradingView || !containerRef.current) return;
      const widget = new (window as any).TradingView.widget({
        container_id: "ml-tv-chart",
        symbol: tvSym,
        interval: tvInt,
        timezone: "Asia/Riyadh",
        theme: "dark",
        style: "1",
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
        disabled_features: [
          "create_volume_indicator_by_default",
          "volume_force_overlay",
          "show_volume_indicator_in_studies",
        ],
        studies_overrides: {
          "volume.volume.visible": false,
        },
        overrides: {
          "mainSeriesProperties.candleStyle.upColor":           "#22c55e",
          "mainSeriesProperties.candleStyle.downColor":         "#ef4444",
          "mainSeriesProperties.candleStyle.borderUpColor":     "#22c55e",
          "mainSeriesProperties.candleStyle.borderDownColor":   "#ef4444",
          "mainSeriesProperties.candleStyle.wickUpColor":       "#22c55e",
          "mainSeriesProperties.candleStyle.wickDownColor":     "#ef4444",
          "paneProperties.background":                          "#0A0A0A",
          "paneProperties.backgroundType":                      "solid",
          "paneProperties.gridProperties.color":                "#1a1a1a",
          "scalesProperties.textColor":                         "#A1A1AA",
          "paneProperties.legendProperties.showVolume":         false,
          "mainSeriesProperties.showVolume":                    false,
        },
        onChartReady: function() {
          (window as any).mlTVWidget = widget;

          // Global: draw a Buy Lion / Sell Lion arrow at a given price
          (window as any).mlTVDrawSignal = (direction: "BUY" | "SELL", price: number, label?: string) => {
            const chart = (window as any).mlTVWidget?.activeChart();
            if (!chart) return;
            try {
              chart.createMultipointShape(
                [{ time: Math.floor(Date.now() / 1000), price }],
                {
                  shape: direction === "BUY" ? "arrow_up" : "arrow_down",
                  text: label ?? (direction === "BUY" ? "Buy Lion" : "Sell Lion"),
                  overrides: {
                    backgroundColor: direction === "BUY" ? "#22c55e" : "#ef4444",
                    color: "#ffffff",
                    fontsize: 13,
                    bold: true,
                  },
                }
              );
            } catch { /* TV shape API may not be available on free tier */ }
          };

          // Global: draw a horizontal line (SL / TP / Entry) on the chart
          (window as any).mlTVDrawHLine = (price: number, color: string, text: string) => {
            const chart = (window as any).mlTVWidget?.activeChart();
            if (!chart) return;
            try {
              chart.createMultipointShape(
                [{ time: Math.floor(Date.now() / 1000), price }],
                {
                  shape: "horizontal_line",
                  text,
                  overrides: { linecolor: color, linewidth: 1, linestyle: 0 },
                }
              );
            } catch {}
          };

          window.dispatchEvent(new CustomEvent("mlChartReady"));
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
      (window as any).mlTVWidget = null;
      (window as any).mlTVDrawSignal = null;
      (window as any).mlTVDrawHLine = null;
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
