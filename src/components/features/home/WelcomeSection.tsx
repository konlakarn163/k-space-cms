"use client";

type WelcomeSectionProps = {
  loading?: boolean;
  tags: string[];
  loadingTags?: boolean;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
};

const TAG_ICONS: Record<string, string> = {
  ai: "✦",
  business: "💼",
  crypto: "◎",
  digital: "❖",
  news: "✺",
  startups: "🚀",
  technology: "⊞",
  trends: "🔥",
  nextjs: "▲",
  supabase: "⚡",
  backend: "⚙",
  design: "◈",
};

function getIcon(tag: string) {
  return TAG_ICONS[tag.toLowerCase()] ?? "·";
}

export default function WelcomeSection({
  tags,
  loadingTags = false,
  selectedTag,
  onSelectTag,
}: WelcomeSectionProps) {
  return (
    <section className="relative flex flex-col items-center px-4 py-12 text-center md:py-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[100px] dark:bg-emerald-500/10" />
      </div>

      <div className="max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
          <span className="bg-linear-to-r from-[#ef5a3c] via-orange-500 to-[#ef5a3c] bg-clip-text text-transparent">
            K-Space CMS:
          </span>
          <br />
          <span className="leading-[1.1]">
            Community for Builders, Thinkers and Creators.
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg dark:text-slate-400">
          A community-driven CMS on{" "}
          <span className="text-slate-900 dark:text-slate-200 font-medium">
            Next.js, Supabase and Express.
          </span>
          <br className="hidden md:block" /> Share engineering notes, product
          updates and collaborative stories.
        </p>
      </div>

      <div className="my-12 h-px w-full max-w-4xl bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

      {loadingTags ? (
        <div className="flex flex-wrap justify-center gap-3 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => onSelectTag("")}
            className={`group flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
              selectedTag === ""
                ? "bg-slate-900 text-white shadow-lg dark:bg-emerald-500 dark:text-slate-950"
                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600"
            }`}
          >
            <span>·</span> All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectTag(selectedTag === tag ? "" : tag)}
              className={`group flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-slate-900 text-white shadow-lg dark:bg-emerald-500 dark:text-slate-950"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600"
              }`}
            >
              <span
                className={
                  selectedTag === tag ? "text-inherit" : "text-emerald-500"
                }
              >
                {getIcon(tag)}
              </span>
              {tag.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
