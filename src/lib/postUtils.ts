import type { User, Session } from '@supabase/supabase-js';
import type { Post } from '@/lib/types';

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getDisplayName(user: User | Session['user'] | null | undefined) {
  if (!user) return 'member';
  return user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'member';
}

export function getAvatarUrl(user: User | Session['user'] | null | undefined) {
  return (
    user?.user_metadata?.avatar_url ??
    user?.user_metadata?.picture ??
    'https://avatars.githubusercontent.com/u/9919?v=4'
  );
}

export function getPostExcerpt(post: Post, length = 160) {
  return stripHtml(post.content).slice(0, length).trim();
}

export function getVoteScore(post: Post) {
  const votes = post.votes ?? [];
  const up = votes.filter((vote) => vote.vote_type === 'up').length;
  const down = votes.filter((vote) => vote.vote_type === 'down').length;
  return up - down;
}

export function getCommentCount(post: Post) {
  return post.comments?.[0]?.count ?? 0;
}

export function getReadingTime(post: Post) {
  const words = stripHtml(post.content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
