"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Micro-ownership",
    body: "Each book is a real digital asset on Stellar. You hold it in your wallet — not in someone else's cloud.",
  },
  {
    title: "Instant finality",
    body: "Transactions settle in 5 seconds. No pending states, no processing delays. Buy a book, own it immediately.",
  },
  {
    title: "Public infrastructure",
    body: "Built on open protocols that no company controls. Your library exists as long as the network does.",
  },
];

export default function ValueCards() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-surface border border-border rounded-lg p-6"
          >
            <h3 className="font-display text-lg text-text-primary mb-2">
              {card.title}
            </h3>
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              {card.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
