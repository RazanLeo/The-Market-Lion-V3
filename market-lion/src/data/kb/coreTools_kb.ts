// Knowledge Base — 23 Core Tools (Table 3)
// Each entry: unique strategy text, calculation formula, algorithm pseudocode.
// NO copy-paste between rows.
export type KBEntry = {
  id: number;
  strategy: string;     // Specific strategy paragraph (unique per tool)
  calculation: string;  // Math formula text
  algorithm: string;    // Pseudocode (short)
  example: string;      // Concrete numeric example
};

export const CORE_TOOLS_KB: Record<number, KBEntry> = {
  1: {
    strategy: "هيكل السوق (Market Structure) يحدّد الاتجاه عبر القمم والقيعان: قمم وقيعان أعلى (HH/HL) = اتجاه صاعد، قمم وقيعان أدنى (LH/LL) = اتجاه هابط. يُكسر الاتجاه بـ BOS (Break of Structure) ويُعكس بـ CHoCH (Change of Character). EQH/EQL تشير إلى سيولة مُتراكمة سيتم سحبها لاحقاً.",
    calculation: "Pivot[i] = High[i] إذا كان أعلى من 5 شموع يمين وشمال • HH = Pivot.High > Pivot.High[الأخيرة] • LL = Pivot.Low < Pivot.Low[الأخيرة].",
    algorithm: "for i in range(5, len-5):\n  if High[i] == max(High[i-5:i+6]): pivots.append(('H', i, High[i]))\n  if Low[i]  == min(Low[i-5:i+6]):  pivots.append(('L', i, Low[i]))\nclassify_trend(pivots) → up/down/range",
    example: "ذهب XAU/USD: قاع 2030 (L) ثم قمة 2055 (H) ثم قاع 2042 (HL) → اتجاه صاعد مؤكد. كسر 2042 = BOS هابط.",
  },
  2: {
    strategy: "نقاط البيفوت (Pivot Points) مستويات دعم ومقاومة محسوبة من إغلاق وقمة وقاع الجلسة السابقة. تُستخدم كأهداف ووقف خسارة. الأنواع: Standard / Fibonacci (تستخدم 0.382, 0.618) / Camarilla (مضاعفات 1.1/12) / Woodie (يعطي الإغلاق وزن مضاعف) / DeMark (شرطية على X).",
    calculation: "PP = (H + L + C) / 3 • R1 = 2PP - L • S1 = 2PP - H • R2 = PP + (H - L) • S2 = PP - (H - L) • R3 = H + 2(PP - L) • S3 = L - 2(H - PP).",
    algorithm: "prev = candles[-1] (previous session bar)\npp = (prev.H + prev.L + prev.C) / 3\nlevels = compute_R1_S1_R2_S2_R3_S3(prev, pp)\nplot(levels) on current chart",
    example: "إغلاق أمس H=2055 L=2030 C=2048 → PP = 2044.33 • R1 = 2058.67 • S1 = 2033.67. السعر الآن 2050 يتجه نحو R1.",
  },
  3: {
    strategy: "نماذج الشموع اليابانية والـ Price Action. نماذج الانعكاس: المطرقة (Hammer)، النجمة الصباحية (Morning Star)، الابتلاع الشرائي (Bullish Engulfing). نماذج الاستمرارية: الثلاث طرق (Rising Three Methods)، الماروبوزو. القراءة تعتمد على السياق (الموقع من S/R + Volume).",
    calculation: "Hammer: body ≤ 30% من المدى الكلي، ذيل سفلي ≥ 2× الجسم، ذيل علوي ≈ 0. Engulfing: شمعة كاملة (جسم + فتيلة) تبتلع الشمعة السابقة في الاتجاه المعاكس.",
    algorithm: "for each candle:\n  body = abs(close - open)\n  range_ = high - low\n  if body/range_ <= 0.3 and (low_wick / body) >= 2.0 and is_at_support(): emit('Hammer Buy')",
    example: "ذهب 15M: شمعة هابطة سابقة (open 2050 close 2042). شمعة حالية: open 2042 close 2055 ابتلعت السابقة كاملاً → Bullish Engulfing عند S1.",
  },
  4: {
    strategy: "خطوط الدعم والمقاومة الأساسية: مستويات تاريخية تكرّر ارتدّ منها السعر ≥ 3 مرات. الأقوى عبر إطارات متعددة (يومي + ٤ساعات). الكسر بإغلاق + ريتست = إشارة تأكيد.",
    calculation: "Level Strength = (touches × volume_ratio) / time_decay. مقاومة قوية إذا touches ≥ 3 + max_distance < 0.3% بين النقاط.",
    algorithm: "cluster_swings(swing_points, tolerance=0.3%) → S/R bands\nrank_by(touches, recent_volume, age) → top_5_levels",
    example: "ذهب 4H: مقاومة 2080 لُمست 4 مرات في 60 يوماً. كسر بإغلاق 2085 + إعادة اختبار 2080 → دخول شراء.",
  },
  5: {
    strategy: "خطوط الدعم والمقاومة الفرعية على الأطر الأصغر (15M-1H). تُستخدم لأهداف قصيرة المدى ووقف خسارة سكالبينج. أضعف من الرئيسية بحيث تُكسر أسهل.",
    calculation: "Minor S/R = swing high/low على إطار 15M ≥ 5 شموع. قوة = ratio عمود لو موجود + نوع الشمعة عند المستوى.",
    algorithm: "minor_pivots = detect_pivots(tf='15M', left=3, right=3)\nfilter(level.distance_to_major > 0.5%) // avoid noise close to majors",
    example: "ذهب 15M: قمة فرعية 2052، قاع فرعي 2048. مدى داخل قناة 2048-2052 → سكالبينج بين النقطتين.",
  },
  6: {
    strategy: "خطوط الاتجاه (Trend Lines): توصل بين قاعين متتاليين (اتجاه صاعد) أو قمتين (اتجاه هابط). يجب لمس 3 نقاط على الأقل للتأكيد. الميل > 30° = اتجاه قوي، < 15° = ضعيف.",
    calculation: "slope = (y₂ - y₁) / (x₂ - x₁). معادلة الخط: y = m·x + b. السعر فوق الخط = صاعد، تحته = هابط.",
    algorithm: "fit_line(swing_lows[-3:]) → trendline_up\nfit_line(swing_highs[-3:]) → trendline_down\nif close < trendline_up.value_at(now): emit('Break Down')",
    example: "ذهب 1H: خط اتجاه صاعد لامس 3 قيعان: 2025، 2032، 2041. السعر الآن 2055 فوق الخط بـ 0.3% → اتجاه سليم.",
  },
  7: {
    strategy: "SMA 200 — متوسط بسيط لـ 200 شمعة. مؤشر اتجاه طويل المدى. السعر فوقه = ثور أكبر، تحته = دب أكبر. تقاطع موت/ذهب مع SMA50.",
    calculation: "SMA200[i] = (C[i-199] + C[i-198] + ... + C[i]) / 200.",
    algorithm: "sma200 = rolling_mean(close, 200)\nbias = 'bull' if last_close > sma200 else 'bear'",
    example: "ذهب يومي: SMA200 = 2018. السعر 2055 → فوقه بـ 1.83% → ثور قوي على المدى الطويل.",
  },
  8: {
    strategy: "SMA 60 — متوسط بسيط لـ 60 شمعة. متوسط مدى. يقيس المزاج خلال ربع سنة. يُستخدم كفلتر لتأكيد دخول SMC.",
    calculation: "SMA60[i] = sum(C[i-59..i]) / 60.",
    algorithm: "sma60 = rolling_mean(close, 60)\nfilter_buy_only_when(last_close > sma60)",
    example: "ذهب يومي: SMA60 = 2035. السعر 2055 فوق المتوسط بـ 0.98% → اتجاه متوسط صاعد.",
  },
  9: {
    strategy: "EMA 7 و 21 (مع التقاطع). متوسطان أسيان سريعان للمضاربة. تقاطع EMA7 فوق EMA21 = Golden Cross شراء، تحته = Death Cross بيع. الأكثر فعالية على 5M و 15M.",
    calculation: "EMA[i] = α·C[i] + (1-α)·EMA[i-1] حيث α = 2/(n+1). للـ EMA7: α = 0.25.",
    algorithm: "ema7  = ema(close, 7)\nema21 = ema(close, 21)\nif ema7[t] > ema21[t] and ema7[t-1] <= ema21[t-1]: emit('Golden Cross Buy')",
    example: "ذهب 15M: EMA7 = 2051.2 ، EMA21 = 2050.8. EMA7 اخترقت EMA21 صعوداً عند 2050.5 → دخول شراء.",
  },
  10: {
    strategy: "FRAMA 126 — Fractal Adaptive Moving Average. يتكيف مع التذبذب: يصبح بطيئاً في الترند ويتسرّع في التذبذب. يقيس Hurst exponent للقياس الذاتي.",
    calculation: "α = exp(-4.6 · (D - 1))، D = dimension فراكتالية محسوبة من H/L نصفي النافذة. FRAMA = α·price + (1-α)·FRAMA_prev.",
    algorithm: "D = compute_fractal_dim(highs, lows, 126)\nalpha = exp(-4.6 * (D - 1))\nframa = alpha * close + (1-alpha) * prev_frama",
    example: "ذهب 1H: D = 1.4 (سوق ترند) → α = 0.16 → FRAMA يتحرك ببطء = توافق مع اتجاه قوي.",
  },
  11: {
    strategy: "قناة الانحراف المعياري (Std-Dev Channel). تأخذ متوسط 20 شمعة وتضيف/تطرح 2×SD. السعر خارج النطاق = تشبع، داخله = طبيعي.",
    calculation: "Mid = SMA(C, 20). Upper = Mid + 2·σ(C, 20). Lower = Mid - 2·σ(C, 20).",
    algorithm: "mid = sma(close, 20)\nsd = stdev(close, 20)\nif last_close > mid + 2*sd: emit('Overbought')\nif last_close < mid - 2*sd: emit('Oversold')",
    example: "ذهب 30M: Mid = 2048، Upper = 2056، Lower = 2040. السعر 2057 خرج فوق → بيع ارتدادي.",
  },
  12: {
    strategy: "قناة الانحدار الخطي (Linear Regression Channel). تَفِيد لمعرفة متوسط السعر العادل عبر النافذة. الاختلال عن الخط الأوسط = فرصة Mean Reversion.",
    calculation: "ax + b بطريقة Least Squares على آخر n شمعة. القناة العلوية = أعلى انحراف، السفلية = أدنى انحراف خلال النافذة.",
    algorithm: "slope, intercept = linregress(range(n), close[-n:])\nmid = slope * t + intercept\nchannel_high = mid + max_residual\nchannel_low  = mid + min_residual",
    example: "ذهب 4H: slope = +0.5/شمعة، السعر 2055 على المنتصف بالضبط → ثابت داخل القناة الصاعدة.",
  },
  13: {
    strategy: "النماذج الفنية الكلاسيكية (Chart Patterns). الرأس والكتفين = انعكاس، المثلثات = استمرار غالباً، القاع/القمة المزدوجة = انعكاس قوي. الراية والوتد = استمرار. الفنجان والمقبض = صعود.",
    calculation: "Head & Shoulders: peak2 > peak1 = peak3 + neckline < peak1.low. Target = neckline - (peak2 - neckline).",
    algorithm: "for each pattern_template in templates:\n  matches = scan(price_history, template)\n  if confidence(matches) > 0.75: emit(pattern_name, target_price)",
    example: "ذهب يومي: قمة 2090 (Head) بين كتفين 2075 و 2078، Neckline 2050. هبوط متوقع لـ 2010.",
  },
  14: {
    strategy: "SMC + ICT (Smart Money Concepts). Order Blocks = آخر شمعة دب قبل صعود مؤسسي (والعكس). BOS = كسر بنية يؤكد اتجاه. CHoCH = تغيّر طابع. FVG = فجوة Fair Value تملأ عادة. Premium/Discount = العلوي/السفلي من Equilibrium.",
    calculation: "OB = candle[i] where Body is opposite color of strong move that follows AND volume > avg×1.5. FVG = gap between H[i-1] and L[i+1] (or vice versa).",
    algorithm: "scan_obs(): for i in range(2, n-2):\n  if direction_changes(i) and vol[i] > avg_vol*1.5: obs.append(i)\nFVGs = find_gaps(highs, lows, threshold=3pips)",
    example: "ذهب 15M: شمعة دب عند 2035 + ثم 8 شموع ثور إلى 2055 → Order Block Buy عند 2034-2036. مع FVG عند 2037-2039.",
  },
  15: {
    strategy: "منهجية ICT الكاملة. Killzones (London 7-10 UTC، NY 12-15 UTC). OTE = Optimal Trade Entry عند 0.62-0.79 fib. Liquidity Pool = تجمع سيولة فوق قمم/تحت قيعان. Judas Swing = صعود وهمي يومي ثم انعكاس. Silver Bullet = نافذة 10-11 NY. Power of 3 = Accumulation → Manipulation → Distribution.",
    calculation: "OTE: داخل impulse leg، رسم fib 0-1، شراء عند 0.62-0.79. Silver Bullet: 60 دقيقة قبل/بعد افتتاح NY إذا تحقق sweep + FVG.",
    algorithm: "is_killzone = current_utc_hour in {7,8,9,10,12,13,14,15}\nif is_killzone and liquidity_swept() and fvg_open(): execute_OTE_entry()",
    example: "ذهب 15M في London Killzone 08:00 UTC: sweep أسفل 2042، عودة + FVG عند 2044 → دخول OTE شراء.",
  },
  16: {
    strategy: "مناطق العرض والطلب. Demand Zone = قاعدة قبل اندفاع صاعد (DBR/RBR). Supply Zone = قاعدة قبل اندفاع هابط. تُرسم من body آخر شمعة دب قبل الصعود.",
    calculation: "Strength = (move_size / base_size) × (volume_avg / volume_baseline). Fresh Zone (لم تُختبر بعد) = أقوى.",
    algorithm: "find_consolidation(min_3_candles_tight) → base\nif explosive_move_after(base): zone = (base.low, base.high, direction)",
    example: "ذهب 1H: قاعدة 4 شموع ضيقة عند 2042-2044 ثم ارتفاع لـ 2060 → Demand Zone 2042-2044 (fresh).",
  },
  17: {
    strategy: "Order Blocks بـ Volume بالدولار. Order Block = أول شمعة معاكسة قبل move قوي، مع volume بالدولار > $10M. يحدد بالضبط مكان تجميع المؤسسات.",
    calculation: "OB_USD_Volume = volume × avg_price. OB_Strength = USD_Volume / avg_USD_Volume_20bars.",
    algorithm: "for ob in detected_obs:\n  usd_vol = ob.volume * ob.avg_price\n  if usd_vol > 10_000_000 and usd_vol/avg_20 > 2: institutional_ob = True",
    example: "ذهب 15M: شمعة دب عند 2034 بحجم $50M ثم 12 شمعة صعود → OB مؤسسي قوي 2033-2035.",
  },
  18: {
    strategy: "Volume — حجم التداول الخام. حجم متزايد مع السعر = تأكيد، حجم متناقص مع السعر = ضعف. Volume Climax = ذروة + شمعة doji = انعكاس.",
    calculation: "Volume_Avg = SMA(V, 20). Spike = V[i] > Volume_Avg × 2.",
    algorithm: "v_avg = sma(volume, 20)\nif volume[i] > v_avg*2 and is_doji(i): emit('Climax Reversal')",
    example: "ذهب 5M: حجم متوسط 800 lots، شمعة حالية 2500 lots + Doji عند 2058 → احتمالية انعكاس عالية.",
  },
  19: {
    strategy: "Order Flow — تدفق الأوامر اللحظي. Time & Sales = شريط الصفقات الفعلية. DOM = عمق السوق (مستويات شراء/بيع المعلقة). Cumulative Delta = (Buy Volume − Sell Volume) متراكم. Absorbed Volume = ضربات لكن السعر لا يتحرك. Iceberg = أوامر مخفية كبيرة.",
    calculation: "Delta[i] = AskVol[i] - BidVol[i]. CumDelta = sum(Delta). Absorption: AggressiveSells > Threshold AND price_change < epsilon.",
    algorithm: "stream_tape() → ticks\ndelta_stream = (t.size if t.side=='ask' else -t.size for t in ticks)\nplot cumulative(delta_stream)",
    example: "ذهب 1M: CumDelta انعكس من +50K إلى -30K بسرعة عند 2056 → ضغط بيع مؤسسي مفاجئ.",
  },
  20: {
    strategy: "نظرية السيولة والفخاخ. BSL = Buy-Side Liquidity (فوق القمم). SSL = Sell-Side Liquidity (تحت القيعان). Sweep = اختراق وهمي يضرب السيولة ثم انعكاس. Stop Hunt = صيد وقف خسائر صغار المتداولين.",
    calculation: "BSL_level = swing_high(recent). Sweep = wick beyond level AND close back inside.",
    algorithm: "if high[i] > recent_swing_high AND close[i] < recent_swing_high - threshold:\n  emit('BSL Sweep Sell Signal')",
    example: "ذهب 30M: قمة سابقة 2060، شمعة حالية فتيلة وصلت 2063 وأغلقت 2055 → BSL Sweep → بيع.",
  },
  21: {
    strategy: "تصحيح فيبوناتشي (Retracement). مستويات: 0.236, 0.382, 0.5, 0.618, 0.786. Golden Zone بين 0.618 و 0.786 = أقوى منطقة دخول. تُرسم من swing low إلى swing high (للاتجاه الصاعد).",
    calculation: "fib_level = high - (high - low) × ratio. مثلاً Golden 0.618 = high - (range × 0.618).",
    algorithm: "swing_high, swing_low = detect_recent_swing()\ngolden = swing_high - (swing_high - swing_low) * 0.618\nif close pulled_back_to(golden) and bullish_pattern(): buy()",
    example: "ذهب 1H: Swing من 2030 إلى 2070 (range 40). 0.618 = 2070 − 24.7 = 2045.3. السعر ارتد عند 2046 → دخول شراء.",
  },
  22: {
    strategy: "امتداد فيبوناتشي (Extension). مستويات: 1.272، 1.414، 1.618، 2.0، 2.618. الأكثر استخداماً 1.618 = هدف ربح. تُرسم لتمديد الموجة الدافعة الحالية.",
    calculation: "ext = swing_high + (swing_high - swing_low) × (ratio - 1). أو من 3 نقاط ABC.",
    algorithm: "extend_1_618 = high + (high - low) * 0.618\nset_tp(extend_1_618)",
    example: "ذهب 1H: bounce من 2046، target 1.618 = 2070 + (40 × 0.618) = 2094.7 ← هدف الربح الثاني.",
  },
  23: {
    strategy: "RSI مع كشف Divergence. RSI > 70 = تشبع شرائي، < 30 = تشبع بيعي. Regular Bullish Divergence = قاع أدنى في السعر + قاع أعلى في RSI = إشارة انعكاس صاعد قوية. Hidden Divergence = استمرار اتجاه.",
    calculation: "RS = AvgGain / AvgLoss. RSI = 100 - (100 / (1 + RS)). نوافذ معتادة 14 شمعة.",
    algorithm: "rsi14 = compute_rsi(close, 14)\nfor i in pivots:\n  if low[i] < low[i-N] and rsi[i] > rsi[i-N]: emit('Bullish Divergence Buy')",
    example: "ذهب 1H: السعر صنع قاع أدنى 2030، RSI صنع قاع أعلى 35 (السابق 28) → Bullish Divergence، شراء عند 2031.",
  },
};
