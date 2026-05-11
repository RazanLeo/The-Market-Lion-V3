import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtMoney(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
}
export function fmtPct(n: number, digits = 2) {
  return `${(n).toFixed(digits)}%`;
}
export function fmtPrice(n: number, digits = 4) {
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}
export function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
