// Exness via Playwright bridge — headless browser on the same droplet
// Bridge runs at scripts/exness_playwright_bridge.py (FastAPI, port 8001)

const EXNESS_BRIDGE = process.env.EXNESS_BRIDGE_URL || "http://localhost:8001";

export type ExnessCreds = { login: string; server: string; password: string };

export async function exnessPlaceOrder(creds: ExnessCreds, p: {
  symbol: string;       // XAUUSD format (no slash)
  direction: "BUY" | "SELL";
  volume: number;
  stopLoss: number;
  takeProfit: number;
}) {
  const r = await fetch(`${EXNESS_BRIDGE}/order`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      login:       creds.login,
      server:      creds.server,
      password:    creds.password,
      symbol:      p.symbol,
      direction:   p.direction,
      volume:      p.volume,
      stop_loss:   p.stopLoss,
      take_profit: p.takeProfit,
    }),
  });
  return r.json();
}

export async function exnessClosePosition(login: string, dealId: string) {
  const r = await fetch(`${EXNESS_BRIDGE}/positions/${login}/${dealId}`, { method: "DELETE" });
  return r.json();
}

export async function exnessGetPositions(login: string) {
  const r = await fetch(`${EXNESS_BRIDGE}/positions/${login}`);
  return r.json();
}

export async function exnessGetAccount(creds: ExnessCreds) {
  const r = await fetch(`${EXNESS_BRIDGE}/account/${creds.login}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(creds),
  });
  return r.json();
}

// Platform symbol → Exness Web Terminal symbol
export const EXNESS_SYMBOLS: Record<string, string> = {
  "XAU/USD": "XAUUSD",
  "XTI/USD": "USOIL",
  "EUR/USD": "EURUSD",
  "GBP/USD": "GBPUSD",
  "USD/JPY": "USDJPY",
  "USD/CHF": "USDCHF",
  "USD/CAD": "USDCAD",
  "AUD/USD": "AUDUSD",
  "NZD/USD": "NZDUSD",
};
