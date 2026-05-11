import Image from "next/image";
import Link from "next/link";

export function Brand({ size = 36, withName = true }: { size?: number; withName?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group select-none">
      <Image
        src="/logo/market-lion-logo.jpg"
        alt="The Market Lion"
        width={size}
        height={size}
        className="rounded-md ring-1 ring-gold-500/40 shadow-glow group-hover:scale-105 transition-transform"
        priority
      />
      {withName && (
        <div className="leading-tight">
          <div className="font-display text-xl gold-text">أسد السوق</div>
          <div className="text-[11px] tracking-wider text-gold-500 font-semibold">THE MARKET LION</div>
        </div>
      )}
    </Link>
  );
}
