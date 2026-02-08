"use client";

import InfoModal from "./info-modal";

export default function WhyDrmModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <InfoModal open={open} onClose={onClose}>
      <h2 className="font-display text-2xl text-text-primary mb-4">
        Why is this book protected?
      </h2>
      <div className="space-y-3 font-body text-sm text-text-secondary leading-relaxed">
        <p>
          Xandria uses lightweight content protection to ensure that authors are fairly compensated.
          When you buy a book, you own a real digital asset — but the text itself is delivered in a way
          that discourages casual redistribution.
        </p>
        <p>
          This isn&apos;t DRM in the traditional sense. There&apos;s no phone-home requirement, no expiration,
          and no lock-in to a specific device. Your ownership is on-chain and permanent. The protection
          simply ensures that the reading experience is tied to verified ownership.
        </p>
        <p>
          Think of it like a signed first edition: the book is yours, but the signature is part of
          what makes it yours. Your wallet address serves as that signature.
        </p>
      </div>
    </InfoModal>
  );
}
