'use client';

type WelcomeSectionProps = {
  loading?: boolean;
  tags: string[];
  loadingTags?: boolean;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
};

const TAG_ICONS: Record<string, string> = {
  ai: '✦',
  business: '💼',
  crypto: '◎',
  digital: '❖',
  news: '✺',
  startups: '🚀',
  technology: '⊞',
  trends: '🔥',
  nextjs: '▲',
  supabase: '⚡',
  backend: '⚙',
  design: '◈',
};

function getIcon(tag: string) {
  return TAG_ICONS[tag.toLowerCase()] ?? '·';
}

export default function WelcomeSection({
  loading = false,
  tags,
  loadingTags = false,
  selectedTag,
  onSelectTag,
}: WelcomeSectionProps) {
  return (
    <section className="flex flex-col items-center text-center gap-6 pb-2">
      {/* Hero text */}
      {loading ? (
        <div className="w-full max-w-3xl space-y-4 animate-pulse">
          <div className="mx-auto h-12 w-3/4 rounded-xl theme-elevated" />
          <div className="mx-auto h-12 w-1/2 rounded-xl theme-elevated" />
          <div className="mx-auto mt-4 h-4 w-2/3 rounded theme-elevated" />
          <div className="mx-auto h-4 w-1/2 rounded theme-elevated" />
        </div>
      ) : (
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <span className="text-[var(--danger)]">K-Space CMS:</span>{' '}
            Community for Builders, Thinkers and Creators.
          </h1>
          <p className="theme-muted mx-auto mt-5 max-w-xl text-sm leading-7 sm:text-base">
            A community-driven CMS on Next.js, Supabase and Express.
            Share engineering notes, product updates and collaborative stories.
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="w-full max-w-4xl border-t border-[var(--border-default)]" />

      {/* Tag chips */}
      {loadingTags ? (
        <div className="flex flex-wrap justify-center gap-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded-full theme-elevated" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => onSelectTag('')}
            className={`tag-chip ${selectedTag === '' ? 'ring-1 ring-[var(--accent)] opacity-100' : 'opacity-60 hover:opacity-90'}`}
          >
            · All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(selectedTag === tag ? '' : tag)}
              className={`tag-chip ${selectedTag === tag ? 'ring-1 ring-[var(--accent)] opacity-100' : 'opacity-60 hover:opacity-90'}`}
            >
              {getIcon(tag)} {tag.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}