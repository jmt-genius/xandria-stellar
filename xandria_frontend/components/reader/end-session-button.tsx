"use client";

export default function EndSessionButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-body text-text-muted hover:text-text-primary border border-border rounded transition-colors"
    >
      End session
    </button>
  );
}
