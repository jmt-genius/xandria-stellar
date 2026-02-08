"use client";

import InfoModal from "./info-modal";

export default function WhatOwnershipModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <InfoModal open={open} onClose={onClose}>
      <h2 className="font-display text-2xl text-text-primary mb-4">
        What does ownership mean here?
      </h2>
      <div className="space-y-3 font-body text-sm text-text-secondary leading-relaxed">
        <p>
          When you buy a book on Xandria, ownership is recorded on the Stellar blockchain. This means
          your purchase exists independently of Xandria — even if this platform disappeared tomorrow,
          the on-chain record of your ownership would persist.
        </p>
        <p>
          Unlike a Kindle purchase, which is really a revocable license, your Xandria book is a
          verifiable asset in your wallet. You bought it. You own it. No one can take it back.
        </p>
        <p>
          In the future, this opens possibilities: reselling books you&apos;ve finished, lending to friends,
          or gifting editions — all without intermediaries. True digital ownership, for the first time.
        </p>
      </div>
    </InfoModal>
  );
}
