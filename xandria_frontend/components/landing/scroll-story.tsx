"use client";

import StoryStep from "./story-step";

const steps = [
  {
    heading: "Discover",
    body: "Browse a curated marketplace of books that matter. No algorithms — just editorial care and reader conviction.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="14" cy="14" r="10" />
        <line x1="21" y1="21" x2="28" y2="28" />
      </svg>
    ),
  },
  {
    heading: "Own",
    body: "When you buy a book, you own it on-chain. Not a license. Not a rental. A real asset with provable provenance.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="8" width="24" height="18" rx="2" />
        <path d="M4 14h24" />
        <circle cx="16" cy="22" r="2" />
      </svg>
    ),
  },
  {
    heading: "Read",
    body: "A distraction-free reader with AI that helps you think — not just consume. Summarize, argue, find counterpoints.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4v24l12-6 12 6V4H4z" />
        <line x1="10" y1="10" x2="22" y2="10" />
        <line x1="10" y1="14" x2="18" y2="14" />
      </svg>
    ),
  },
  {
    heading: "Lend",
    body: "Share your books with others without giving them up. Lending creates trust networks, not piracy.",
    comingSoon: true,
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 16h16" />
        <path d="M20 10l6 6-6 6" />
        <circle cx="6" cy="16" r="2" />
      </svg>
    ),
  },
  {
    heading: "Pass On",
    body: "Resell, gift, or bequeath your books. Digital ownership that outlasts the platform.",
    comingSoon: true,
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 26L16 6l10 20" />
        <line x1="10" y1="18" x2="22" y2="18" />
      </svg>
    ),
  },
];

export default function ScrollStory() {
  return (
    <section>
      {steps.map((step) => (
        <StoryStep key={step.heading} {...step} />
      ))}
    </section>
  );
}
