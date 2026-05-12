import { NextRequest, NextResponse } from "next/server";

/**
 * Financial GPT chat endpoint.
 * Uses Anthropic / OpenRouter / OpenAI if a key is configured.
 * Otherwise falls back to a rule-based local financial assistant so the chat NEVER returns empty.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM = `أنت "أسد السوق GPT" — مساعد ذكاء اصطناعي مالي مخصص للتداول داخل منصة The Market Lion. مهمتك:
1) شرح ما يحدث في الجداول الثمانية (التحليل الأساسي، الأدوات، المدارس، المؤشرات، تدفق الأوامر، القرار النهائي، خطة التداول).
2) الإجابة على أي سؤال مالي/فني/أساسي للمتداول بلغة بسيطة ومحترفة.
3) شرح إشارات Buy Lion / Sell Lion ومستويات الثقة (Crown / 🟢 / 🟡 / ⚪).
4) شرح Risk Management وكيفية حساب اللوت و SL و TPs.
5) عرض الموسمية وموسم الأخبار وتأثيرها على الأصل المختار.
6) لغة الجواب تطابق لغة السؤال. لا تخلط بين العربي والإنجليزي.
7) لا تقدّم نصائح استثمارية مضمونة — قل أن النتيجة احتمالية.
8) أبق الإجابات مركزة وعملية، تجنّب الحشو.`;

async function callAnthropic(messages: Msg[]): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM,
        messages: messages.filter(m => m.role !== "system"),
      }),
    });
    if (!r.ok) return null;
    const data: any = await r.json();
    return data?.content?.[0]?.text ?? null;
  } catch { return null; }
}

async function callOpenRouter(messages: Msg[]): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        // Free tier model
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [{ role: "system", content: SYSTEM }, ...messages],
        max_tokens: 800,
      }),
    });
    if (!r.ok) return null;
    const data: any = await r.json();
    return data?.choices?.[0]?.message?.content ?? null;
  } catch { return null; }
}

// Local rules-based fallback so chat is never silent.
function localFallback(question: string, context: any): string {
  const q = question.toLowerCase();
  const asset = context?.asset || "XAU/USD";
  const conf = context?.confluence;
  const dir  = conf?.direction;

  // Greetings
  if (/^(مرحبا|أهلا|اهلا|سلام|hi|hello|hey)/i.test(question.trim())) {
    return `مرحبًا 👋 أنا أسد السوق GPT. الأصل الحالي: ${asset}. اسألني عن:\n• القرار النهائي وسبب الإشارة الحالية\n• الفرق بين الجداول الثمانية\n• شرح أي أداة، مدرسة، أو مؤشر\n• خطة التداول الموصى بها\n• كيف يعمل البوت ومتى يدخل`;
  }
  if (/buy lion|sell lion|قرار|إشارة|الاشارة|إشارة/i.test(q)) {
    if (!conf) return "القرار النهائي يتطلب تشغيل التحليل أولاً. تأكدي من اختيار الأصل وتشغيل البوت.";
    const tier = conf.tier;
    const tierAr = tier === "CROWN" ? "إشارة Crown" : tier === "STRONG" ? "إشارة قوية 🟢" : tier === "WEAK" ? "إشارة ضعيفة 🟡" : "لا إشارة ⚪";
    return `القرار النهائي حالياً لـ ${asset}:\n• الاتجاه: ${dir === "BUY" ? "Buy Lion 🟢" : dir === "SELL" ? "Sell Lion 🔴" : "محايد"}\n• درجة Confluence: ${conf.abs?.toFixed(1)}%\n• المستوى: ${tierAr}\n• البوت ${conf.shouldBotEnter ? "جاهز للدخول ✅" : "في الانتظار (لم تتحقق العتبة 75%) ⏳"}\n\nيتم احتساب الدرجة من 5 جداول بأوزانها: التحليل الأساسي 20% + الأدوات 30% + المدارس 25% + المؤشرات 10% + تدفق الأوامر 15%.`;
  }
  if (/risk|مخاطرة|lot|اللوت|stop|sl|tp|هدف/i.test(q)) {
    return `📐 إدارة المخاطر في أسد السوق:\n• حد المخاطرة الأقصى لكل صفقة: 5% من رأس المال\n• Risk:Reward الأدنى: 1:3 إلزامي\n• Stop Loss يُحسب من ATR (1.5×) + المستويات الفنية\n• 4 أهداف ربح: 1:1، 1:2، 1:3، 1:4 — تخرج 25%، 50%، 75%، 100% من الحجم\n• Trailing Stop: بعد TP1 ينتقل SL إلى Breakeven، بعد TP2 ينتقل إلى TP1\n• حساب اللوت: مبلغ المخاطرة ÷ (SL بالنقاط × قيمة النقطة)`;
  }
  if (/(fomc|fed|بنك|فائدة|cpi|تضخم|nfp|وظائف)/i.test(q)) {
    return `📅 الأحداث الاقتصادية الكبرى لها تأثير ضخم على الذهب والدولار:\n• قرار الفائدة (FOMC) — كل 6 أسابيع، يحرّك الذهب 2-3%\n• CPI Headline & Core — شهرياً، يحرّك السعر 1-2%\n• NFP — أول جمعة من الشهر، تذبذب فوري\n• خطابات Powell — تحرّك السعر فورياً\n\nالبوت يتوقف 30 دقيقة قبل وبعد الأخبار الكبرى لتفادي السبريد العشوائي.`;
  }
  if (/(smc|ict|order block|fvg)/i.test(q)) {
    return `📚 SMC + ICT (Smart Money Concepts):\n• Order Blocks: آخر شمعة معاكسة قبل move قوي → دعم/مقاومة مؤسسي\n• BOS (Break of Structure): كسر قمة/قاع سابق يؤكد الاتجاه\n• CHoCH (Change of Character): إشارة انعكاس\n• FVG (Fair Value Gap): فجوة عادة تُملأ\n• Liquidity Sweep: حركة وهمية لسحب وقف الخسائر قبل الاتجاه الحقيقي\n• Premium/Discount: شراء من Discount (نصف سفلي)، بيع من Premium\n• OTE: دخول مثالي عند 0.62-0.79 fib`;
  }
  if (/(fibo|فيبو|فيبوناتشي)/i.test(q)) {
    return `📐 فيبوناتشي:\n• تصحيح (Retracement): 0.236 / 0.382 / 0.5 / 0.618 / 0.786\n• Golden Zone (الأقوى): بين 0.618 و 0.786 — دخول مثالي\n• امتداد (Extension): 1.272 / 1.618 / 2.618 — أهداف الربح\n\nالرسم: من Swing Low إلى Swing High (للترند الصاعد)، أو العكس.`;
  }
  // Generic helpful answer
  return `سؤالك: "${question}"\n\nلتحليل أعمق أحتاج تفاصيل أكثر:\n• هل تسألين عن الأصل ${asset} أم أصل آخر؟\n• هل تريدين شرح أداة محددة أو مدرسة من الجداول؟\n• أو هل تريدين رأياً في إشارة معينة؟\n\nيمكنك أيضًا فتح أي أيقونة 📄 داخل الجداول لرؤية الاستراتيجية الكاملة لأي أداة.`;
}

export async function POST(req: NextRequest) {
  const { messages, context } = await req.json().catch(() => ({}));
  if (!Array.isArray(messages) || !messages.length) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  // Augment last user message with context for the LLM
  const enriched: Msg[] = [...messages];
  if (context) {
    enriched.unshift({ role: "system", content: `سياق الواجهة الحالي:\n${JSON.stringify(context, null, 2)}` });
  }

  // Try real LLM providers (in order of preference)
  let reply = await callAnthropic(enriched);
  if (!reply) reply = await callOpenRouter(enriched);
  if (!reply) reply = localFallback(messages[messages.length - 1].content, context);

  return NextResponse.json({ role: "assistant", content: reply, ts: Date.now() });
}
