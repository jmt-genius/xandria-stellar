"use client";

export default function WhyPeopleRead({ reasons }: { reasons: string[] }) {
  return (
    <div>
      <h3 className="font-body text-xs tracking-[0.08em] uppercase text-text-muted mb-4">
        Why people read this
      </h3>
      <div className="space-y-3">
        {reasons.map((reason, i) => (
          <div key={i} className="border-l-2 border-accent pl-4">
            <p className="font-body text-sm text-text-secondary leading-relaxed">
              {reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
