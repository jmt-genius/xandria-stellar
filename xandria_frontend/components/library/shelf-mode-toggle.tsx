"use client";

import type { ShelfMode } from "@/types";

const modes: { value: ShelfMode; label: string }[] = [
  { value: "chronological", label: "Chronological" },
  { value: "theme", label: "By Theme" },
  { value: "emotional", label: "By Mood" },
];

export default function ShelfModeToggle({
  current,
  onChange,
}: {
  current: ShelfMode;
  onChange: (mode: ShelfMode) => void;
}) {
  return (
    <div className="flex gap-2">
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={`px-3 py-1.5 text-xs font-body whitespace-nowrap rounded transition-colors ${
            current === mode.value
              ? "bg-accent text-background"
              : "bg-surface border border-border text-text-secondary hover:text-text-primary"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
