import { apiFetch, buildApiUrl } from '@/lib/api';
import type { Post, PostPage } from '@/lib/types';
import type { Session } from '@supabase/supabase-js';

export const fetchPosts = async ({
  session,
  limit = 8,
  cursor,
  query,
  tag,
}: {
  session?: Session | null;
  limit?: number;
  cursor?: string | null;
  query?: string;
  tag?: string;
}): Promise<PostPage> => {
  const url = buildApiUrl('/api/posts', {
    limit,
    cursor: cursor ?? '',
    query: query ?? '',
    tag: tag ?? '',
  });

  const response = await fetch(url, {
    headers: session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : undefined,
  });

  if (!response.ok) {
    throw new Error('Cannot load posts');
  }

  return response.json() as Promise<PostPage>;
};

export const fetchPostById = async ({
  session,
  postId,
}: {
  session?: Session | null;
  postId: string;
}): Promise<Post> => {
  return apiFetch<Post>(`/api/posts/${postId}`, {}, session);
};

export const createPost = async ({
  session,
  title,
  content,
  imageUrl,
  tags,
}: {
  session: Session;
  title: string;
  content: string;
  imageUrl: string | null;
  tags: string[];
}): Promise<Post> => {
  return apiFetch<Post>(
    '/api/posts',
    {
      method: 'POST',
      body: JSON.stringify({ title, content, imageUrl, tags }),
    },
    session,
  );
};

export const updatePost = async ({
  session,
  postId,
  title,
  content,
  imageUrl,
  tags,
}: {
  session: Session;
  postId: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  tags?: string[];
}): Promise<Post> => {
  return apiFetch<Post>(
    `/api/posts/${postId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ title, content, imageUrl, tags }),
    },
    session,
  );
};

export const deletePost = async ({
  session,
  postId,
}: {
  session: Session;
  postId: string;
}): Promise<void> => {
  return apiFetch<void>(`/api/posts/${postId}`, { method: 'DELETE' }, session);
};
