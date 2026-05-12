// Universal broker adapter — Exness & Capital.com primary, plus any MT4/MT5 broker.
export type Broker = {
  id: string;
  name: string;
  defaultServer?: string;
  protocols: ("MT4" | "MT5" | "cTrader" | "FIX")[];
  primary?: boolean;
};

export const BROKERS: Broker[] = [
  { id: "exness",      name: "Exness",              protocols: ["MT4","MT5"], defaultServer: "Exness-MT5Trial15", primary: true },
  { id: "capital",     name: "Capital.com",         protocols: ["MT4","MT5"], primary: true },
  { id: "ic_markets",  name: "IC Markets",          protocols: ["MT4","MT5","cTrader"] },
  { id: "pepperstone", name: "Pepperstone",         protocols: ["MT4","MT5","cTrader"] },
  { id: "xm",          name: "XM",                  protocols: ["MT4","MT5"] },
  { id: "fbs",         name: "FBS",                 protocols: ["MT4","MT5"] },
  { id: "fxtm",        name: "FXTM",                protocols: ["MT4","MT5"] },
  { id: "hot_forex",   name: "HotForex / HFM",      protocols: ["MT4","MT5"] },
  { id: "ftmo",        name: "FTMO",                protocols: ["MT4","MT5","cTrader"] },
  { id: "oanda",       name: "OANDA",               protocols: ["MT4"] },
  { id: "thinkmarkets",name: "ThinkMarkets",        protocols: ["MT4","MT5"] },
  { id: "other",       name: "Other (custom)",       protocols: ["MT4","MT5","cTrader","FIX"] },
];
