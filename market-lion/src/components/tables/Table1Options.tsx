"use client";
import { ASSETS } from "@/data/assets";
import { TIMEFRAMES, TF_REFERENCE } from "@/data/timeframes";
import { useState } from "react";
import { TableShell } from "./TableShell";
import { LionMark } from "../LionMark";
import { Play, Square, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export function Table1Options({ onChange }: { onChange?: (s: any) => void }) {
  const { t, locale } = useI18n();
  const [asset, setAsset] = useState("XAU/USD");
  const [riskPct, setRiskPct] = useState(2);
  const [capital, setCapital] = useState(10000);
  const [tf, setTf] = useState<typeof TIMEFRAMES[number]>("15M");
  const [mode, setMode] = useState<"BOT"|"MANUAL">("BOT");
  const [running, setRunning] = useState(false);
  const refs = TF_REFERENCE[tf];
  const emit = (next: any) => onChange?.({ asset, riskPct, capital, tf, mode, ...next });

  // Localized asset display name (just symbol + native name in current locale)
  const assetName = (a: typeof ASSETS[0]) => {
    if (locale === "ar") return `${a.symbol} — ${a.nameAr}`;
    return `${a.symbol} — ${a.nameEn}`;
  };

  return (
    <TableShell number={1} title={t("tables.t1.title")} subtitle={t("tables.t1.subtitle")}>
      <table className="tbl">
        <thead>
          <tr>
            <th>{t("tables.t1.col_n")}</th>
            <th>{t("tables.t1.col_option")}</th>
            <th>{t("tables.t1.col_desc")}</th>
            <th>{t("tables.t1.col_value")}</th>
          </tr>
        </thead>
        <tbody>
          <Row n={1} k={t("tables.t1.opt_asset")} desc={t("tables.t1.opt_asset_desc")}>
            <select value={asset} onChange={e => { setAsset(e.target.value); emit({asset: e.target.value}); }}
              className="bg-bg-card border border-gold-500/25 rounded-md px-2 py-1.5 text-sm">
              {ASSETS.map(a => <option key={a.symbol} value={a.symbol}>{assetName(a)}</option>)}
            </select>
          </Row>
          <Row n={2} k={t("tables.t1.opt_risk")} desc={t("tables.t1.opt_risk_desc")}>
            <select value={riskPct} onChange={e => { const v = +e.target.value; setRiskPct(v); emit({riskPct:v}); }}
              className="bg-bg-card border border-gold-500/25 rounded-md px-2 py-1.5 text-sm">
              {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}%</option>)}
            </select>
          </Row>
          <Row n={3} k={t("tables.t1.opt_amount")} desc={t("tables.t1.opt_amount_desc")}>
            <span className="text-gold-400 font-semibold">${(capital * riskPct/100).toFixed(2)}</span>
          </Row>
          <Row n={4} k={t("tables.t1.opt_tf")} desc={t("tables.t1.opt_tf_desc")}>
            <select value={tf} onChange={e => { const v = e.target.value as any; setTf(v); emit({tf:v}); }}
              className="bg-bg-card border border-gold-500/25 rounded-md px-2 py-1.5 text-sm">
              {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Row>
          <Row n={5} k={t("tables.t1.opt_tf_ref")} desc={t("tables.t1.opt_tf_ref_desc")}>
            <span className="text-zinc-200 font-semibold">{refs.join(" + ")}</span>
          </Row>
          <Row n={6} k={t("tables.t1.opt_mode")} desc={t("tables.t1.opt_mode_desc")}>
            <select value={mode} onChange={e => { const v = e.target.value as any; setMode(v); emit({mode:v}); }}
              className="bg-bg-card border border-gold-500/25 rounded-md px-2 py-1.5 text-sm">
              <option value="BOT">{t("mode.bot")}</option>
              <option value="MANUAL">{t("mode.manual")}</option>
            </select>
          </Row>
        </tbody>
      </table>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="text-sm text-zinc-300">{t("tables.t1.capital_label")}</label>
        <input type="number" value={capital} onChange={e => { const v = +e.target.value; setCapital(v); emit({capital:v}); }}
          className="bg-bg-card border border-gold-500/25 rounded-md px-2 py-1.5 text-sm w-32"/>
        <div className="ms-auto flex items-center gap-2">
          <button
            onClick={() => setRunning(r => !r)}
            className={running
              ? "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold bg-red-700 text-white hover:bg-red-800 shadow"
              : "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-bold animate-pulseGold"}
            style={running ? {} : {
              background: "linear-gradient(180deg, #FFD54F 0%, #D4AF37 50%, #A8821F 100%)",
              color: "#0A0A0A",
              boxShadow: "0 6px 20px rgba(212,175,55,0.30)",
            }}>
            <LionMark size={22}/>
            {running ? <Square size={16}/> : <Play size={16}/>}
            {running ? t("btn.stop_lion_bot") : t("btn.start_lion_bot")}
          </button>
          <button className="rounded-xl px-4 py-2 font-bold bg-green-600 text-white hover:bg-green-700"><ArrowUpRight size={16} className="inline"/> {t("btn.manual_buy")}</button>
          <button className="rounded-xl px-4 py-2 font-bold bg-red-600  text-white hover:bg-red-700"><ArrowDownRight size={16} className="inline"/> {t("btn.manual_sell")}</button>
        </div>
      </div>
    </TableShell>
  );
}

function Row({n,k,desc,children}: any) {
  return <tr><td className="text-zinc-400">{n}</td><td className="font-semibold">{k}</td><td className="text-zinc-400">{desc}</td><td>{children}</td></tr>;
}
