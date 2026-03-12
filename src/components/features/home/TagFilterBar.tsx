type TagFilterBarProps = {
  loading?: boolean;
  selectedTag: string;
  tags: string[];
  onSelectTag: (tag: string) => void;
};

export default function TagFilterBar({ loading = false, selectedTag, tags, onSelectTag }: TagFilterBarProps) {
  if (loading) {
    return (
      <section className="space-y-3 animate-pulse">
        <div>
          <div className="h-3 w-32 rounded theme-elevated" />
          <div className="mt-2 h-8 w-20 rounded theme-elevated" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-7 w-20 rounded theme-elevated" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <div>
        <p className="theme-muted text-xs uppercase tracking-[0.24em]">Browse by topic</p>
        <h2 className="font-serif mt-2 text-2xl font-bold">Tags</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelectTag('')}
          className={`tag-chip ${selectedTag === '' ? 'opacity-100 ring-1 ring-(--accent)' : 'opacity-70'}`}
        >
          All posts
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onSelectTag(selectedTag === tag ? '' : tag)}
            className={`tag-chip ${selectedTag === tag ? 'opacity-100 ring-1 ring-(--accent)' : 'opacity-70'}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
