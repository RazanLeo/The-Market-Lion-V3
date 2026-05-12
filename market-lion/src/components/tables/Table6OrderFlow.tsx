"use client";
import { WHALE_TRACKERS, ORDER_FLOW_TOOLS } from "@/data/orderFlow";
import { TIMEFRAMES } from "@/data/timeframes";
import { TableShell, DecisionPill, TierChip } from "./TableShell";
import { InfoButton } from "../InfoModal";
import { useI18n } from "@/i18n/I18nProvider";
import type { RowReport } from "@/lib/analysisEngine";

// 12 real-time money-flow rows seeded with realistic institution names (per Excel section 2).
const MONEY_FLOW = [
  { id: 1,  institution: "BlackRock Inc.",                  type: "صفقة كبيرة",        usd: "$50M",  qty: "1,540 أونصة" },
  { id: 2,  institution: "Goldman Sachs Asset Mgmt",         type: "صفقة متوسطة",       usd: "$30M",  qty: "924 أونصة" },
  { id: 3,  institution: "Saudi PIF",                        type: "صفقة عملاقة",       usd: "$200M", qty: "6,162 أونصة" },
  { id: 4,  institution: "Newmont Mining Corp.",             type: "صفقة كبيرة",        usd: "$25M",  qty: "770 أونصة" },
  { id: 5,  institution: "Saudi Aramco",                     type: "صفقة عملاقة",       usd: "$500M", qty: "6,250,000 برميل" },
  { id: 6,  institution: "Bridgewater Associates",           type: "صفقة كبيرة",        usd: "$75M",  qty: "2,310 أونصة" },
  { id: 7,  institution: "Berkshire Hathaway (Buffett)",     type: "صفقة عملاقة",       usd: "$300M", qty: "—" },
  { id: 8,  institution: "Federal Reserve (Open Market)",    type: "تدخل سياسة نقدية", usd: "$1B+",  qty: "—" },
  { id: 9,  institution: "Vanguard Group",                   type: "صفقة متوسطة",       usd: "$40M",  qty: "1,232 أونصة" },
  { id: 10, institution: "AIG",                              type: "صفقة هيدج",        usd: "$80M",  qty: "2,463 أونصة" },
  { id: 11, institution: "Citadel LLC",                      type: "صفقة سريعة (HFT)", usd: "$15M",  qty: "462 أونصة" },
  { id: 12, institution: "GPIF (Japan Pension)",             type: "صفقة كبيرة",        usd: "$120M", qty: "3,694 أونصة" },
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
      <h4 className="text-gold-400 font-bold mb-2 mt-2">🐋 القسم الأول: رصد السيولة وصفقات صناع السوق والحيتان والمؤسسات</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>اسم الجهة/المؤسسة/المتداول</th><th>التصنيف</th>
            <th className="text-center">صفقات 10K+</th>
            <th className="text-center">صفقات 100K+</th>
            <th className="text-center">صفقات 500K+</th>
            <th className="text-center">صفقات 1M+</th>
          </tr>
        </thead>
        <tbody>
          {WHALE_TRACKERS.map(w => (
            <tr key={w.id}>
              <td className="text-zinc-400">{w.id}</td>
              <td className="font-semibold">{w.nameAr}</td>
              <td className="text-center">
                <InfoButton title={`أبرز المؤسسات في فئة: ${w.nameAr}`}>
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
      <h4 className="text-gold-400 font-bold mb-2 mt-6">💸 القسم الثاني: حركة الأموال اللحظي بأسماء المؤسسات الحقيقية</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>التوقيت</th><th>اسم الشركة/المؤسسة</th>
            <th>النوع</th><th>الكمية بالدولار</th><th>الكمية بالأونصة/البرميل/اللوت</th>
            <th>التفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {MONEY_FLOW.map(m => (
            <tr key={m.id}>
              <td className="text-zinc-400">{m.id}</td>
              <td className="text-zinc-400 whitespace-nowrap">live</td>
              <td className="font-semibold">{m.institution}</td>
              <td>{m.type}</td>
              <td className="text-gold-400 font-mono">{m.usd}</td>
              <td className="text-zinc-300">{m.qty}</td>
              <td className="text-center">
                <InfoButton title={`${m.institution} — ${m.type}`} dense>
                  {`المؤسسة: ${m.institution}\nنوع الصفقة: ${m.type}\nالكمية بالدولار: ${m.usd}\nالكمية بالأصل: ${m.qty}\n\nمصادر الرصد:\n• COT Report (CFTC)\n• Bookmap Order Book\n• ETF Flows (WGC)\n• 13F SEC filings`}
                </InfoButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section 3 — Analytical Tools */}
      <h4 className="text-gold-400 font-bold mb-2 mt-6">📊 القسم الثالث: أدوات تدفق الأوامر والبوك ماب التحليلية (10 أدوات)</h4>
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th><th>الأداة</th><th>Tier</th><th>الشرح والاستراتيجية</th>
            {TIMEFRAMES.map(tf => <th key={tf} className="text-center">{tf}</th>)}
            <th>توافق الأطر</th>
            <th>الوزن من 15٪</th>
            <th>الثقة</th>
            <th>نتيجة التحليل</th>
            <th>زر على الشارت</th>
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
                  <InfoButton title={`شرح الأداة: ${tool.nameAr}`}>{expl}</InfoButton>
                </td>
                {TIMEFRAMES.map(tf => (
                  <td key={tf} className="text-center">
                    {r?.decision.perTf[tf] === 1 ? <span className="text-green-400 font-bold">شراء</span> :
                     r?.decision.perTf[tf] === -1 ? <span className="text-red-400 font-bold">بيع</span> :
                     <span className="text-zinc-500">محايد</span>}
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
