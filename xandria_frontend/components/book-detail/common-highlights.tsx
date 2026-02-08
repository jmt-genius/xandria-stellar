"use client";

type Highlight = { quote: string; count: number };

export default function CommonHighlights({ highlights }: { highlights: Highlight[] }) {
  return (
    <div>
      <h3 className="font-body text-xs tracking-[0.08em] uppercase text-text-muted mb-4">
        Most highlighted
      </h3>
      <div className="space-y-4">
        {highlights.map((h, i) => (
          <div key={i}>
            <p className="font-reader text-base italic text-text-secondary leading-relaxed">
              &ldquo;{h.quote}&rdquo;
            </p>
            <p className="font-mono text-[11px] text-text-muted mt-1">
              {h.count.toLocaleString()} highlights
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
