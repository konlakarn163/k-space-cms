import Image from "next/image";

type PostPreviewPanelProps = {
  content: string;
  coverPreviewUrl: string | null;
  tags: string[];
  title: string;
};

export default function PostPreviewPanel({
  content,
  coverPreviewUrl,
  tags,
  title,
}: PostPreviewPanelProps) {
  return (
    <aside className="theme-card rounded-4xl border p-5 sm:p-6">
      <p className="theme-muted text-xs uppercase tracking-[0.24em]">
        Live preview
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl group flex h-full flex-col gap-4 theme-surface">
        <div className="post-card-img group rounded-2xl overflow-hidden">
          {coverPreviewUrl ? (
            <Image
              src={coverPreviewUrl}
              alt="cover preview"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              unoptimized
            />
          ) : (
            <div className="theme-muted flex h-full items-center justify-center font-serif text-5xl">
              {title.trim().charAt(0) || "P"}
            </div>
          )}

          {tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="line-clamp-2 text-2xl font-bold">
            {title.trim() || "Your story title will appear here"}
          </h2>

          <div
            className="theme-prose max-w-none line-clamp-2 text-sm leading-6"
            dangerouslySetInnerHTML={{
              __html: content || "<p>Start writing to preview your story.</p>",
            }}
          />
        </div>
      </div>
    </aside>
  );
}
