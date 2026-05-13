"use client";
import { WHALE_TRACKERS, ORDER_FLOW_TOOLS } from "@/data/orderFlow";
import { TIMEFRAMES } from "@/data/timeframes";
import { TableShell, DecisionPill, TierChip } from "./TableShell";
import { InfoButton } from "../InfoModal";
import { useI18n } from "@/i18n/I18nProvider";
import type { RowReport } from "@/lib/analysisEngine";

// 12 real-time money-flow rows seeded with realistic institution names (per Excel section 2).
const MONEY_FLOW = [
  { id: 1,  institution: "BlackRock Inc.",                  typeKey: "t6.type.big",        usd: "$50M",  qty: "1,540 oz" },
  { id: 2,  institution: "Goldman Sachs Asset Mgmt",         typeKey: "t6.type.medium",       usd: "$30M",  qty: "924 oz" },
  { id: 3,  institution: "Saudi PIF",                        typeKey: "t6.type.giant",       usd: "$200M", qty: "6,162 oz" },
  { id: 4,  institution: "Newmont Mining Corp.",             typeKey: "t6.type.big",        usd: "$25M",  qty: "770 oz" },
  { id: 5,  institution: "Saudi Aramco",                     typeKey: "t6.type.giant",       usd: "$500M", qty: "6,250,000 bbl" },
  { id: 6,  institution: "Bridgewater Associates",           typeKey: "t6.type.big",        usd: "$75M",  qty: "2,310 oz" },
  { id: 7,  institution: "Berkshire Hathaway (Buffett)",     typeKey: "t6.type.giant",       usd: "$300M", qty: "—" },
  { id: 8,  institution: "Federal Reserve (Open Market)",    typeKey: "t6.type.monetary", usd: "$1B+",  qty: "—" },
  { id: 9,  institution: "Vanguard Group",                   typeKey: "t6.type.medium",       usd: "$40M",  qty: "1,232 oz" },
  { id: 10, institution: "AIG",                              typeKey: "t6.type.hedge",        usd: "$80M",  qty: "2,463 oz" },
  { id: 11, institution: "Citadel LLC",                      typeKey: "t6.type.hft", usd: "$15M",  qty: "462 oz" },
  { id: 12, institution: "GPIF (Japan Pension)",             typeKey: "t6.type.big",        usd: "$120M", qty: "3,694 oz" },
];

const TOOL_EXPLANATIONS: Record<string, string> = {
  "Cumulative Delta": "تجميع الفرق بين حجم الشراء (Bid) وحجم البيع (Ask) عبر الزمن. يُحدد ميل صناع السوق: إذا تراكمت الدلتا للأعلى = ضغط شراء مؤسسي، والعكس = ضغط بيع. الاستراتيجية: مراقبة الانحرافات (Divergences) بين السعر والدلتا التراكمية لاكتشاف انعكاسات مؤكدة.",
  "Footprint Chart": "خريطة الحجم لكل شمعة على مستوى السعر (Bid × Ask Volume). يكشف الإمتصاص والإغراق. الاستراتيجية: شراء عند POC (Point of Control) في ذيل الشمعة + Imbalance قوي.",
  "DOM Level 2": "عمق السوق — كل الأوامر المعلقة (Limit Orders) شراء/بيع على ٢٠ مستوى سعري. الاستراتيجية: قراءة جدران السيولة والأوامر الكبيرة.",
  "Iceberg Detector": "كشف الأوامر المخفية الكبيرة التي تظهر بكميات صغيرة متتالية. الاستراتيجية: التداول في اتجاه الـ Iceberg.",
  "Absorption Detector": "رصد امتصاص السيولة عند مستويات حرجة — البائعون يضربون لكن السعر لا ينزل. الاستراتيجية: شراء عند الامتصاص الإيجابي.",
  "Stop Hunt Detector": "كشف مناطق صيد وقف الخسائر (Liquidity Sweep). الاستراتيجية: انتظار اختراق وهمي ثم العودة → دخول معاكس.",
  "ARC Break Detection": "خوارزمية كشف الكسر السعري المبكر قبل التأكيد. الاستراتيجية: دخول بكسر وإعادة اختبار.",
  "Bookmap BUMP/DUMP": "كشف الإغراق/الصعود المفاجئ في الـ DOM. الاستراتيجية: تأكيد الاتجاه بـ DOM imbalance.",
  "Liquidity Voids": "فجوات السيولة في DOM (مناطق فارغة). الاستراتيجية: السعر يميل لملء الفراغ.",
  "Volume Climax": "ذروة الحجم — تنبيه لاحتمالية الانعكاس. الاستراتيجية: عند ذروة + رفض = انعكاس.",
};

export function Table6OrderFlow({ rows }: { rows: RowReport[] }) {
  const { t } = useI18n();
  return (
    <TableShell number={6}
      title={t("tables.t6.title")}
      subtitle={t("tables.t6.subtitle")}
      weight="15%">

      {/* Section 1 — Whale Tracker (15 institutional categories) */}
      <h4 className="text-gold-400 font-bold mb-2 mt-2">{t("t6.section1.title")}</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>{t("t6.col.entity")}</th><th>{t("vote.col.category")}</th>
            <th className="text-center">{t("t6.col.deals_10k")}</th>
            <th className="text-center">{t("t6.col.deals_100k")}</th>
            <th className="text-center">{t("t6.col.deals_500k")}</th>
            <th className="text-center">{t("t6.col.deals_1m")}</th>
          </tr>
        </thead>
        <tbody>
          {WHALE_TRACKERS.map(w => (
            <tr key={w.id}>
              <td className="text-zinc-400">{w.id}</td>
              <td className="font-semibold">{w.nameAr}</td>
              <td className="text-center">
                <InfoButton title={`${t("t6.info.top_institutions")}: ${w.nameAr}`}>
                  {`الفئة: ${w.nameAr}\n\nأبرز المؤسسات:\n${w.examples.map(e => "• " + e).join("\n")}\n\nيرصد البوت لحظياً حجم صفقات هذه المؤسسات عبر:\n- تقارير COT الأسبوعية من CFTC\n- بيانات Bookmap للـ Order Book\n- ETF Flows من WGC\n- إيداعات 13F من SEC.`}
                </InfoButton>
              </td>
              <td className="text-center text-zinc-300">—</td>
              <td className="text-center text-zinc-300">—</td>
              <td className="text-center text-zinc-300">—</td>
              <td className="text-center text-zinc-300">—</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section 2 — Real-Time Money Flow */}
      <h4 className="text-gold-400 font-bold mb-2 mt-6">{t("t6.section2.title")}</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>{t("t6.col.time")}</th><th>{t("t6.col.company")}</th>
            <th>{t("t6.col.type")}</th><th>{t("t6.col.usd_amount")}</th><th>{t("t6.col.qty_units")}</th>
            <th>{t("t6.col.details")}</th>
          </tr>
        </thead>
        <tbody>
          {MONEY_FLOW.map(m => (
            <tr key={m.id}>
              <td className="text-zinc-400">{m.id}</td>
              <td className="text-zinc-400 whitespace-nowrap">live</td>
              <td className="font-semibold">{m.institution}</td>
              <td>{t(m.typeKey)}</td>
              <td className="text-gold-400 font-mono">{m.usd}</td>
              <td className="text-zinc-300">{m.qty}</td>
              <td className="text-center">
                <InfoButton title={`${m.institution} — ${t(m.typeKey)}`} dense>
                  {`${t("t6.info.institution")}: ${m.institution}\n${t("t6.info.deal_type")}: ${t(m.typeKey)}\n${t("t6.info.usd_qty")}: ${m.usd}\n${t("t6.info.asset_qty")}: ${m.qty}\n\n${t("t6.info.sources")}:\n• COT Report (CFTC)\n• Bookmap Order Book\n• ETF Flows (WGC)\n• 13F SEC filings`}
                </InfoButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section 3 — Analytical Tools */}
      <h4 className="text-gold-400 font-bold mb-2 mt-6">{t("t6.section3.title")}</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>{t("t6.col.tool")}</th><th className="hidden">Tier</th><th>{t("t6.col.strategy")}</th>
            {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th>{t("vote.col.tf_alignment")}</th>
            <th>{t("vote.col.weight_of")} 15%</th>
            <th>{t("vote.col.confidence")}</th>
            <th>{t("vote.col.result")}</th>
            <th>{t("vote.col.chart")}</th>
          </tr>
        </thead>
        <tbody>
          {ORDER_FLOW_TOOLS.map((tool, idx) => {
            const r = rows[idx];
            const buyCount = r ? TIMEFRAMES.filter(tf => r.decision.perTf[tf] === 1).length : 0;
            const sellCount = r ? TIMEFRAMES.filter(tf => r.decision.perTf[tf] === -1).length : 0;
            const expl = TOOL_EXPLANATIONS[tool.nameEn] || tool.descriptionAr;
            return (
              <tr key={tool.id}>
                <td className="text-zinc-400">{tool.id}</td>
                <td className="font-semibold">{tool.nameAr}</td>
                <td><TierChip tier={tool.tier}/></td>
                <td className="text-center">
                  <InfoButton title={`${t("vote.col.explanation")}: ${tool.nameAr}`}>{expl}</InfoButton>
                </td>
                {TIMEFRAMES.map(tf => (
                  <td key={tf} className="text-center">
                    {r?.decision.perTf[tf] === 1 ? <span className="text-green-400 font-bold">{t("common.buy")}</span> :
                     r?.decision.perTf[tf] === -1 ? <span className="text-red-400 font-bold">{t("common.sell")}</span> :
                     <span className="text-zinc-500">{t("common.neutral")}</span>}
                  </td>
                ))}
                <td className="text-center text-xs">
                  <span className="text-green-400">{buyCount}</span> · <span className="text-red-400">{sellCount}</span>
                </td>
                <td className="text-center text-zinc-300 font-mono">{r ? r.decision.weighted.toFixed(3) : "—"}</td>
                <td className="text-center text-gold-400">{r ? (r.decision.confidence*100).toFixed(0) + "%" : "—"}</td>
                <td className="text-center">
                  {r && <DecisionPill d={r.decision.decision}/>}
                </td>
                <td className="text-center"><OFToggle/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableShell>
  );
}

function OFToggle() {
  return (
    <label className="inline-flex items-center cursor-pointer select-none gap-2">
      <input type="checkbox" className="peer sr-only"/>
      <span className="w-9 h-5 rounded-full bg-zinc-700 peer-checked:bg-gold-500 relative transition-all
        before:content-[''] before:absolute before:top-0.5 before:end-0.5 before:w-4 before:h-4
        before:rounded-full before:bg-white before:transition-all peer-checked:before:end-[18px]"></span>
      <span className="text-[10px] text-zinc-400">OFF</span>
    </label>
  );
}
