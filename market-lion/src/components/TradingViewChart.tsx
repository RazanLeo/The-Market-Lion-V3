"use client";
const TV_SYMBOL: Record<string, string> = {
  "XAU/USD": "OANDA:XAUUSD", "XTI/USD": "TVC:USOIL",
  "EUR/USD": "FX:EURUSD",  "GBP/USD": "FX:GBPUSD", "USD/JPY": "FX:USDJPY",
  "USD/CHF": "FX:USDCHF",  "USD/CAD": "FX:USDCAD",
  "AUD/USD": "FX:AUDUSD",  "NZD/USD": "FX:NZDUSD",
};
const TV_INTERVAL: Record<string, string> = {
  "1M":"1","5M":"5","15M":"15","30M":"30","1H":"60","4H":"240",
};

/** Real TradingView chart via official embed iframe — always loads. */
export function TradingViewChart({
  symbol = "XAU/USD", interval = "15M", height = 800
}: { symbol?: string; interval?: string; height?: number }) {
  const tvSym = TV_SYMBOL[symbol] || TV_SYMBOL["XAU/USD"];
  const tvInt = TV_INTERVAL[interval] || "15";
  const url = `https://s.tradingview.com/widgetembed/?frameElementId=ml-chart`
    + `&symbol=${encodeURIComponent(tvSym)}`
    + `&interval=${tvInt}`
    + `&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=1`
    + `&toolbarbg=0A0A0A&studies=%5B%22STD%3BEMA%22%2C%22Volume%40tv-basicstudies%22%2C%22RSI%40tv-basicstudies%22%2C%22BB%40tv-basicstudies%22%5D`
    + `&theme=dark&style=1&timezone=Asia%2FRiyadh`
    + `&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D`
    + `&locale=en&utm_source=marketlion`;
  return (
    <iframe
      id="ml-chart"
      title="TradingView Chart"
      src={url}
      style={{
        width: "100%",
        height,
        border: "1px solid rgba(174,145,83,0.30)",
        borderRadius: 18,
        background: "#0A0A0A",
        display: "block",
      }}
      allow="fullscreen"
      allowFullScreen
    />
  );
}
