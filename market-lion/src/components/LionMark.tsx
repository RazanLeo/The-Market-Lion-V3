import Image from "next/image";

/** LionMark — the official lion logo as an inline mark.
 * Use this EVERYWHERE the brand mark is needed. NEVER 🦁 emoji.
 */
export function LionMark({
  size = 24, className = "", priority = false
}: { size?: number; className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo/market-lion-logo.jpg"
      alt="The Market Lion"
      width={size}
      height={size}
      className={`inline-block align-middle rounded-md ring-1 ring-gold-500/30 ${className}`}
      priority={priority}
    />
  );
}
