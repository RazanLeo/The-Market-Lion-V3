import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "أسد السوق — The Market Lion",
  description: "روبوت ومؤشر رزان للتداول بالذكاء الاصطناعي • Razan AI Trading Bot & Indicator",
  icons: { icon: "/logo/market-lion-logo.jpg" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-bg text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
