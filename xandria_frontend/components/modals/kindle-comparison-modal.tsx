"use client";

import InfoModal from "./info-modal";

export default function KindleComparisonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <InfoModal open={open} onClose={onClose}>
      <h2 className="font-display text-2xl text-text-primary mb-4">
        How is this different from Kindle?
      </h2>
      <div className="space-y-4 font-body text-sm text-text-secondary leading-relaxed">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-body text-xs tracking-[0.08em] uppercase text-text-muted mb-2">Kindle</p>
            <ul className="space-y-1.5">
              <li>License to read (revocable)</li>
              <li>Locked to Amazon ecosystem</li>
              <li>Cannot resell or transfer</li>
              <li>Amazon controls your library</li>
            </ul>
          </div>
          <div>
            <p className="font-body text-xs tracking-[0.08em] uppercase text-accent mb-2">Xandria</p>
            <ul className="space-y-1.5">
              <li>True ownership (on-chain)</li>
              <li>Open protocol (Stellar)</li>
              <li>Transfer & resale (coming)</li>
              <li>You control your library</li>
            </ul>
          </div>
        </div>
        <p>
          The core difference: Kindle gives you access. Xandria gives you ownership. Access can be
          revoked. Ownership cannot.
        </p>
      </div>
    </InfoModal>
  );
}
