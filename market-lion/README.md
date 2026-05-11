# 🦁 أسد السوق — The Market Lion (v3)

**Razan AI Trading Bot, Indicator & Analyzer** — منصة بوت ومؤشر ومحلل تداول عالمي يعمل بالذكاء الاصطناعي بالكامل.

---

## نظرة عامة

منصة شاملة للتحليل المالي والفني بالذكاء الاصطناعي تجمع بين:
- التحليل الأساسي الكامل (مؤشرات اقتصادية، أخبار، تصريحات وتغريدات)
- التحليل الفني الشامل (٢٣ أداة رئيسية + ٤٨ مدرسة + ٥٤ مؤشر)
- تدفق الأوامر والبوك ماب وتتبع صناع السوق والحيتان
- محرك التصويت الموزون → قرار نهائي Buy Lion / Sell Lion 🦁
- خطة تداول كاملة (R:R 1:3 إلزامي، SL، TP×4، Trailing Stop)
- تشغيل البوت الآلي + التداول اليدوي

## المكدس التقني

- **Next.js 14** (App Router) + **TypeScript** + **TailwindCSS**
- **Prisma** + **Postgres** (DigitalOcean Managed DB)
- **NextAuth.js** للمصادقة
- **lightweight-charts** للرسم البياني (بديل مجاني عن TradingView)
- **next-intl** لـ ١٢ لغة عالمية (RTL/LTR)

## التشغيل المحلي

```bash
npm install
cp .env.example .env
# Update DATABASE_URL and NEXTAUTH_SECRET in .env
npx prisma migrate dev --name init
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## النشر على Digital Ocean

التفاصيل في [DEPLOYMENT.md](./DEPLOYMENT.md).

## الترخيص

© 2026 رزان توفيق. جميع الحقوق محفوظة.
