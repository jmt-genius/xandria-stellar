export default function IdeasAbsorbed({ concepts }: { concepts: string[] }) {
  if (concepts.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="font-body text-xs tracking-[0.08em] uppercase text-text-muted mb-4">
        Ideas absorbed
      </h3>
      <div className="flex flex-wrap gap-2">
        {concepts.map((concept, i) => (
          <span
            key={concept}
            className="px-3 py-1 bg-accent-subtle text-accent border border-accent/20 rounded-full font-body"
            style={{
              fontSize: i < 3 ? "13px" : "11px",
            }}
          >
            {concept}
          </span>
        ))}
      </div>
    </div>
  );
}
