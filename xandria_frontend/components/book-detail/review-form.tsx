"use client";

import { useState } from "react";

const availableTags = [
  "inspiring", "challenging", "timeless", "relevant",
  "eye-opening", "dense", "beautiful prose", "practical",
];

export default function ReviewForm({ bookId }: { bookId: number }) {
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag].slice(0, 3)
    );
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    // Mock submission
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-border rounded-lg p-4">
        <p className="font-body text-sm text-text-secondary">
          Your reflection has been shared.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, 280))}
        placeholder="Share a reflection..."
        className="w-full bg-transparent border-none text-sm text-text-primary placeholder:text-text-muted focus:outline-none resize-none h-20 font-body"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="font-mono text-[10px] text-text-muted">
          {content.length}/280
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-2 py-0.5 text-[10px] rounded-full border transition-colors ${
              selectedTags.includes(tag)
                ? "bg-accent-subtle text-accent border-accent/30"
                : "bg-transparent text-text-muted border-border hover:border-text-muted"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className="mt-3 px-4 py-1.5 text-xs font-body bg-accent text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Share reflection
      </button>
    </div>
  );
}
