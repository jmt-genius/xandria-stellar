"use client";

import type { AuthorProfile } from "@/types";

export default function AuthorHeader({ author }: { author: AuthorProfile }) {
  return (
    <div className="mb-10">
      <h1 className="font-display text-4xl text-text-primary">{author.name}</h1>
      <div className="border-t border-border mt-3 pt-4">
        <p className="font-body text-text-secondary leading-relaxed max-w-2xl">
          {author.bio}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {author.fields.map((field) => (
          <span
            key={field}
            className="px-3 py-1 text-xs bg-accent-subtle text-accent rounded-full border border-accent/20 font-body"
          >
            {field}
          </span>
        ))}
      </div>
      <p className="font-mono text-[11px] text-text-muted mt-6">
        {author.address}
      </p>
    </div>
  );
}
