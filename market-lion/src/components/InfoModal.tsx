"use client";
import { useState, ReactNode } from "react";
import { FileText, X } from "lucide-react";

/**
 * Per-cell info button: small "paper" icon. Click → opens a modal with the
 * full detailed analysis / strategy explanation that does NOT fit the cell.
 */
export function InfoButton({ title, children, dense = false }:
  { title: string; children: ReactNode; dense?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`inline-flex items-center justify-center rounded-md text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 transition ${dense ? "w-5 h-5" : "w-7 h-7"}`}
        aria-label={title}
        title={title}
      >
        <FileText size={dense ? 12 : 14}/>
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center p-4"
             onClick={() => setOpen(false)}>
          <div className="gold-card max-w-2xl w-full p-6 shadow-gold"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gold-400 font-bold text-lg">{title}</h3>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                <X size={18}/>
              </button>
            </div>
            <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
