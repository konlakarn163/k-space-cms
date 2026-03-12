'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { Post } from '@/lib/types';
import PostGrid from '@/components/features/home/PostGrid';
import WelcomeSection from '@/components/features/home/WelcomeSection';
import { fetchPosts } from '@/services/postService';
import { fetchTags, type MasterTag } from '@/services/tagService';
import { supabase } from '@/utils/supabase/client';

type HomeContentProps = {
  user: User | null;
};

export default function HomeContent({ user: _user }: HomeContentProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [masterTags, setMasterTags] = useState<MasterTag[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    void initSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const loadPosts = useCallback(
    async (mode: 'reset' | 'append') => {
      mode === 'reset' ? setLoadingPosts(true) : setLoadingMore(true);

      try {
        const response = await fetchPosts({
          session,
          limit: 9,
          cursor: mode === 'append' ? nextCursor : null,
          tag: selectedTag,
        });

        setPosts((prev) => (mode === 'append' ? [...prev, ...response.posts] : response.posts));
        setNextCursor(response.nextCursor);
        setHasMore(response.hasMore);
      } finally {
        setLoadingPosts(false);
        setLoadingMore(false);
      }
    },
    [nextCursor, selectedTag, session],
  );

  const loadTags = useCallback(async () => {
    setLoadingTags(true);
    try {
      const result = await fetchTags({ session });
      setMasterTags(result);
    } finally {
      setLoadingTags(false);
    }
  }, [session]);

  useEffect(() => {
    void loadPosts('reset');
  }, [loadPosts, selectedTag, session?.access_token]);

  useEffect(() => {
    void loadTags();
  }, [loadTags]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingPosts && !loadingMore) {
          void loadPosts('append');
        }
      },
      { threshold: 0.8 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadPosts, loadingMore, loadingPosts]);

  return (
    <div className="theme-canvas min-h-screen">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <WelcomeSection
          loading={loadingPosts && posts.length === 0}
          tags={masterTags.map((t) => t.name)}
          loadingTags={loadingTags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        <PostGrid loading={loadingPosts} posts={posts} />

        <div ref={sentinelRef} className="h-8" />

        {loadingMore ? <p className="theme-muted text-center text-sm">Loading more stories…</p> : null}
        {!hasMore && posts.length > 0 ? (
          <p className="theme-muted text-center text-xs uppercase tracking-[0.2em]">End of archive</p>
        ) : null}
      </main>
    </div>
  );
}