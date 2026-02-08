const activities = [
  "A reader finished Meditations",
  "Someone highlighted 12 passages in 1984",
  "A new reflection was shared on The Art of War",
  "A reader started Pride and Prejudice",
  "Someone finished The Great Gatsby for the second time",
];

export default function CommunityActivity() {
  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h3 className="font-body text-xs tracking-[0.08em] uppercase text-text-muted mb-4">
        What others finished this week
      </h3>
      <ul className="space-y-2.5">
        {activities.map((activity, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
            <p className="font-body text-sm text-text-secondary">{activity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
