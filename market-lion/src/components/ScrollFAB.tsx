"use client";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { usePathname } from "next/navigation";

export function ScrollFAB() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as any });
  }, [pathname]);

  // Show FAB only after scrolling a bit
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 end-6 z-[90] flex flex-col gap-2" style={{ opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none", transition: "opacity 200ms" }}>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        title="إلى الأعلى"
        className="w-12 h-12 rounded-full grid place-items-center shadow-gold"
        style={{ background: "linear-gradient(180deg, #CDB462 0%, #AE9153 50%, #8F723A 100%)", color: "#0A0A0A" }}
      >
        <ArrowUp size={20}/>
      </button>
      <button
        onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
        aria-label="Scroll to bottom"
        title="إلى الأسفل"
        className="w-12 h-12 rounded-full grid place-items-center border border-gold-500/40 bg-bg-card text-gold-400 hover:bg-gold-500/10"
      >
        <ArrowDown size={20}/>
      </button>
    </div>
  );
}
