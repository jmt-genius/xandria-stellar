type BookCoverProps = {
  coverUri: string;
  title: string;
  textSize?: string;
};

export default function BookCover({ coverUri, title, textSize = "text-lg" }: BookCoverProps) {
  return coverUri ? (
    <img
      src={coverUri}
      alt={title}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  ) : (
    <div className="w-full h-full bg-surface-hover flex items-center justify-center">
      <span className={`font-display ${textSize} text-text-muted text-center px-4`}>
        {title}
      </span>
    </div>
  );
}
