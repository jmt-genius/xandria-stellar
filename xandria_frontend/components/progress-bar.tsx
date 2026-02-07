"use client";

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[2px] z-50">
      <div
        className="h-full bg-accent transition-all duration-200"
        style={{ width: `${Math.min(progress * 100, 100)}%` }}
      />
    </div>
  );
}
