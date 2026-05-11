# 🦁 The Market Lion — أسد السوق (v3)

**Razan AI Trading Bot, Indicator & Analyzer** — منصة بوت ومؤشر ومحلل تداول عالمي بالذكاء الاصطناعي.

> النسخة الكاملة المتطابقة مع البرومبت v3 ومستند الجداول الثمانية.

## نظرة عامة

منصة شاملة تجمع:
- **التحليل الأساسي** الكامل (مؤشرات اقتصادية + أخبار + تصريحات وتغريدات).
- **التحليل الفني** الشامل (٢٣ أداة + ٤٨ مدرسة + ٥٤ مؤشر).
- **تدفق الأوامر والبوك ماب** وتتبّع صناع السوق والحيتان.
- **محرك التصويت الموزون** → قرار نهائي **Buy Lion 🦁 / Sell Lion 🦁**.
- **خطة تداول كاملة** (R:R 1:3 إلزامي، SL، TP×4، Trailing Stop).
- **بوت آلي + تداول يدوي** بربط مباشر مع MT5/Exness.

## بنية المستودع

```
.
├── market-lion/          ← التطبيق Next.js 14 (TypeScript + TailwindCSS + Prisma)
├── docs/                 ← وثائق النشر والربط مع MT5
├── scripts/              ← وسيط Python لاتصال MetaTrader 5
└── .github/workflows/    ← CI (build) للنشر التلقائي
```

## التشغيل المحلي

```bash
cd market-lion
npm install
cp .env.example .env       # حدّث DATABASE_URL و NEXTAUTH_SECRET
npx prisma migrate dev --name init
npm run dev                # http://localhost:3000
```

## النشر

- App Platform على Digital Ocean: راجع [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- ربط MT5 / Exness: راجع [`docs/MT5-CONNECTION.md`](docs/MT5-CONNECTION.md)

## المراجع المرفقة

- البرومبت الكامل (Word) و الجداول الكاملة (Excel) — موجودان في الجذر للرجوع.
- الشعار `IMG_1732.jpg` — مستخدم في كل صفحات المنصة.

© 2026 رزان توفيق — جميع الحقوق محفوظة.
