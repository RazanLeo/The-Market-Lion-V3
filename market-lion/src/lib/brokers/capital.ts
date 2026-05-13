// Capital.com REST API integration — primary broker
// Docs: https://open-api.capital.com/

const CAPITAL_BASE = "https://api-capital.backend-capital.com";
const CAPITAL_DEMO = "https://demo-api-capital.backend-capital.com";

export type CapitalCreds = { apiKey: string; email: string; password: string; demo: boolean };

type Session = { cst: string; xSecurityToken: string; base: string };

async function capitalSession(creds: CapitalCreds): Promise<Session> {
  const base = creds.demo ? CAPITAL_DEMO : CAPITAL_BASE;
  const r = await fetch(`${base}/api/v1/session`, {
    method: "POST",
    headers: { "x-cap-api-key": creds.apiKey, "content-type": "application/json" },
    body: JSON.stringify({ identifier: creds.email, password: creds.password }),
  });
  if (!r.ok) throw new Error(`Capital session failed: ${r.status} ${await r.text()}`);
  return {
    cst: r.headers.get("CST") ?? "",
    xSecurityToken: r.headers.get("X-SECURITY-TOKEN") ?? "",
    base,
  };
}

function authHeaders(s: Session) {
  return { "CST": s.cst, "X-SECURITY-TOKEN": s.xSecurityToken, "content-type": "application/json" };
}

export async function capitalPlaceOrder(creds: CapitalCreds, p: {
  epic: string; direction: "BUY" | "SELL"; size: number; stopLevel: number; profitLevel: number;
}) {
  const s = await capitalSession(creds);
  const r = await fetch(`${s.base}/api/v1/positions`, {
    method: "POST",
    headers: authHeaders(s),
    body: JSON.stringify({
      epic: p.epic,
      direction: p.direction,
      size: p.size,
      guaranteedStop: false,
      stopLevel: p.stopLevel,
      profitLevel: p.profitLevel,
    }),
  });
  return r.json();
}

export async function capitalClosePosition(creds: CapitalCreds, dealId: string) {
  const s = await capitalSession(creds);
  const r = await fetch(`${s.base}/api/v1/positions/${dealId}`, {
    method: "DELETE",
    headers: authHeaders(s),
  });
  return r.json();
}

export async function capitalGetPositions(creds: CapitalCreds) {
  const s = await capitalSession(creds);
  const r = await fetch(`${s.base}/api/v1/positions`, { headers: authHeaders(s) });
  return r.json();
}

export async function capitalGetAccount(creds: CapitalCreds) {
  const s = await capitalSession(creds);
  const r = await fetch(`${s.base}/api/v1/accounts`, { headers: authHeaders(s) });
  return r.json();
}

// Platform symbol → Capital.com epic
export const CAPITAL_EPICS: Record<string, string> = {
  "XAU/USD": "GOLD",
  "XTI/USD": "OIL_CRUDE",
  "EUR/USD": "EURUSD",
  "GBP/USD": "GBPUSD",
  "USD/JPY": "USDJPY",
  "USD/CHF": "USDCHF",
  "USD/CAD": "USDCAD",
  "AUD/USD": "AUDUSD",
  "NZD/USD": "NZDUSD",
};
