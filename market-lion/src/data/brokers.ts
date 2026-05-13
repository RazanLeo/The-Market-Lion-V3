// Supported brokers — Capital.com (REST API) and Exness (Web Terminal via Playwright).
// No MT5/MetaTrader app required for either broker.

export type BrokerType = "CAPITAL" | "EXNESS";

export type Broker = {
  id: string;
  name: string;
  type: "REST" | "WEB_BRIDGE";
  primary?: boolean;
  description: string;
  fields: BrokerField[];
};

export type BrokerField = {
  key: string;
  label: string;
  type: "text" | "email" | "password" | "checkbox";
  required: boolean;
  placeholder?: string;
};

export const BROKERS: Broker[] = [
  {
    id: "capital",
    name: "Capital.com",
    type: "REST",
    primary: true,
    description: "REST API رسمي — موصى للتسجيل والتجربة. Demo account مجاني.",
    fields: [
      { key: "email",    label: "البريد الإلكتروني",    type: "email",    required: true,  placeholder: "you@email.com" },
      { key: "password", label: "كلمة مرور Capital.com", type: "password", required: true },
      { key: "apiKey",   label: "API Key",                type: "text",     required: true,  placeholder: "من account settings → API management" },
      { key: "demo",     label: "حساب تجريبي (Demo)",    type: "checkbox", required: false },
    ],
  },
  {
    id: "exness",
    name: "Exness",
    type: "WEB_BRIDGE",
    primary: false,
    description: "عبر Exness Web Terminal — بدون أي تطبيق إضافي.",
    fields: [
      { key: "login",    label: "رقم الحساب (Login)",  type: "text",     required: true, placeholder: "260842468" },
      { key: "server",   label: "السيرفر (Server)",     type: "text",     required: true, placeholder: "Exness-MT5Trial15" },
      { key: "password", label: "كلمة المرور",           type: "password", required: true },
    ],
  },
];
