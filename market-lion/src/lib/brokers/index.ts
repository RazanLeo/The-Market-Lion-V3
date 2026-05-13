import {
  capitalPlaceOrder, capitalClosePosition, capitalGetPositions, capitalGetAccount,
  CAPITAL_EPICS, type CapitalCreds,
} from "./capital";
import {
  exnessPlaceOrder, exnessClosePosition, exnessGetPositions, exnessGetAccount,
  EXNESS_SYMBOLS, type ExnessCreds,
} from "./exness";
import { decrypt } from "@/lib/crypto";

export type BrokerType = "CAPITAL" | "EXNESS";

export interface OrderParams {
  asset: string;
  direction: "BUY" | "SELL";
  lots: number;
  sl: number;
  tp: number;
}

export async function brokerPlaceOrder(
  broker: BrokerType,
  encryptedCreds: Record<string, any>,
  p: OrderParams
) {
  if (broker === "CAPITAL") {
    const creds: CapitalCreds = {
      apiKey:   decrypt(encryptedCreds.apiKey   ?? ""),
      email:    encryptedCreds.email,
      password: decrypt(encryptedCreds.password ?? ""),
      demo:     Boolean(encryptedCreds.demo),
    };
    return capitalPlaceOrder(creds, {
      epic:        CAPITAL_EPICS[p.asset] ?? p.asset,
      direction:   p.direction,
      size:        p.lots,
      stopLevel:   p.sl,
      profitLevel: p.tp,
    });
  }

  // EXNESS — via Playwright bridge
  const creds: ExnessCreds = {
    login:    encryptedCreds.login,
    server:   encryptedCreds.server,
    password: decrypt(encryptedCreds.password ?? ""),
  };
  return exnessPlaceOrder(creds, {
    symbol:     EXNESS_SYMBOLS[p.asset] ?? p.asset.replace("/", ""),
    direction:  p.direction,
    volume:     p.lots,
    stopLoss:   p.sl,
    takeProfit: p.tp,
  });
}

export async function brokerClosePosition(
  broker: BrokerType,
  encryptedCreds: Record<string, any>,
  dealId: string
) {
  if (broker === "CAPITAL") {
    const creds: CapitalCreds = {
      apiKey:   decrypt(encryptedCreds.apiKey   ?? ""),
      email:    encryptedCreds.email,
      password: decrypt(encryptedCreds.password ?? ""),
      demo:     Boolean(encryptedCreds.demo),
    };
    return capitalClosePosition(creds, dealId);
  }
  return exnessClosePosition(encryptedCreds.login, dealId);
}

export async function brokerGetPositions(
  broker: BrokerType,
  encryptedCreds: Record<string, any>
) {
  if (broker === "CAPITAL") {
    const creds: CapitalCreds = {
      apiKey:   decrypt(encryptedCreds.apiKey   ?? ""),
      email:    encryptedCreds.email,
      password: decrypt(encryptedCreds.password ?? ""),
      demo:     Boolean(encryptedCreds.demo),
    };
    return capitalGetPositions(creds);
  }
  return exnessGetPositions(encryptedCreds.login);
}

export { CAPITAL_EPICS, EXNESS_SYMBOLS };
