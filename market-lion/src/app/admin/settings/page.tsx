import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = { title: "Settings — Admin" };
export default function Settings() {
  return (
    <>
      <Header variant="app"/>
      <main className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="font-display gold-text text-2xl mb-4">Platform Settings</h1>
        <div className="gold-card p-6 space-y-4 text-zinc-300">
          <div><b className="text-gold-400">Active languages:</b> Arabic, English, Brazilian Portuguese, Portuguese, Korean, Chinese, Hindi, Spanish, French, German, Russian, Japanese</div>
          <div><b className="text-gold-400">Price — Individual:</b> SAR 2,000/month</div>
          <div><b className="text-gold-400">Price — Institution:</b> SAR 6,000/month</div>
          <div><b className="text-gold-400">Bot entry threshold:</b> ≥ 75% Confluence Score</div>
          <div><b className="text-gold-400">Minimum Risk:Reward:</b> 1:3</div>
          <div><b className="text-gold-400">News blackout:</b> ±30 min around high-impact events</div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
