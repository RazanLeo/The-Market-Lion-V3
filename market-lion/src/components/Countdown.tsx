"use client";
import { useEffect, useState } from "react";

/**
 * Countdown to a fixed time-of-day (UTC), repeating daily/weekly.
 * If the time has passed today, shows "صدر اليوم — جاري التحديث" or counts to next occurrence.
 */
export function Countdown({ utcTime, cadence = "daily" }:
  { utcTime: string; cadence?: "daily" | "weekly" | "monthly" | "live" }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (utcTime === "لحظي" || utcTime === "live" || cadence === "live") { setText("لحظي"); return; }
    const m = utcTime.match(/(\d{1,2}):(\d{2})\s*UTC/i);
    if (!m) { setText(utcTime); return; }
    const targetHours = parseInt(m[1], 10);
    const targetMins  = parseInt(m[2], 10);

    function tick() {
      const now = new Date();
      const target = new Date(Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
        targetHours, targetMins, 0
      ));
      if (target.getTime() < now.getTime()) {
        // already passed; for daily events, next occurrence is tomorrow
        target.setUTCDate(target.getUTCDate() + 1);
      }
      const ms = target.getTime() - now.getTime();
      const h = Math.floor(ms / 3_600_000);
      const mn = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      if (h === 0 && mn === 0 && s < 60) {
        setText(`⏱️ ${s} ث`);
      } else if (h === 0) {
        setText(`⏱️ ${mn} د`);
      } else if (h < 24) {
        setText(`⏱️ ${h}س ${mn}د`);
      } else {
        setText("غدًا");
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [utcTime, cadence]);

  return <span className="text-[10px] text-gold-500 font-mono">{text}</span>;
}
