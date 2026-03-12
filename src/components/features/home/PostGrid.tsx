import type { Post } from '@/lib/types';
import PostCard from '@/components/features/posts/PostCard';

type PostGridProps = {
  loading: boolean;
  posts: Post[];
};

export default function PostGrid({ loading, posts }: PostGridProps) {
  if (loading && posts.length === 0) {
    return (
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="post-card animate-pulse overflow-hidden">
            <div className="h-48 w-full theme-elevated" />
            <div className="space-y-3 p-5">
              <div className="h-6 w-full rounded theme-elevated" />
              <div className="h-6 w-4/5 rounded theme-elevated" />
              <div className="h-3 w-1/2 rounded theme-elevated" />
              <div className="h-4 w-full rounded theme-elevated" />
              <div className="h-4 w-[82%] rounded theme-elevated" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className=" p-10 text-center">
        <p className="theme-muted text-xs uppercase tracking-[0.24em]">No results</p>
        <h3 className="font-serif mt-3 text-3xl font-bold">No posts found for this view.</h3>
        <p className="theme-muted mt-3 text-sm">Try another search term or pick a different tag.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="theme-muted text-xs uppercase tracking-[0.24em]">Latest stories</p>
        <h2 className="font-serif mt-2 text-2xl font-bold">Community cards</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
