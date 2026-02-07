import { formatMintNumber } from "@/lib/stellar";

export default function MintNumberOverlay({ mintNumber }: { mintNumber: number }) {
  return (
    <span
      className="absolute bottom-3 right-3 font-mono text-[11px] text-accent/85 z-10"
      style={{ textShadow: "0 0 12px rgba(217,169,99,0.4)" }}
    >
      {formatMintNumber(mintNumber)}
    </span>
  );
}
