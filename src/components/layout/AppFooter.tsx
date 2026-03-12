export default function AppFooter() {
  return (
    <footer className="dark:bg-[var(--background)] theme-border border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 sm:px-6 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif text-lg font-bold" style={{ color: 'var(--accent)' }}>
          K-Space CMS
        </p>
        <p className="theme-muted text-xs uppercase tracking-[0.2em]">
          Built with Next.js · Express · Supabase · Tiptap
        </p>
      </div>
    </footer>
  );
}
