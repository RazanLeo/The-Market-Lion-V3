import type { Metadata } from "next";
import "@/styles/globals.css";
import { I18nProvider } from "@/i18n/I18nProvider";

export const metadata: Metadata = {
  title: "أسد السوق — The Market Lion",
  description: "روبوت ومؤشر رزان للتداول بالذكاء الاصطناعي • Razan AI Trading Bot & Indicator",
  icons: { icon: "/logo/market-lion-logo.jpg" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-bg text-zinc-100 min-h-screen">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
