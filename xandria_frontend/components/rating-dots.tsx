type RatingDotsProps = {
  rating: number;
  votes?: number;
  dotSize?: string;
};

export default function RatingDots({ rating, votes, dotSize = "w-1.5 h-1.5" }: RatingDotsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`${dotSize} rounded-full ${
              i <= Math.round(rating) ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </div>
      {votes != null && (
        <span className="text-text-muted text-xs">({votes})</span>
      )}
    </div>
  );
}
