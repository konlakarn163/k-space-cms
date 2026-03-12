import { apiFetch } from '@/lib/api';
import type { Comment } from '@/lib/types';
import type { Session } from '@supabase/supabase-js';

export const fetchComments = async ({
  session,
  postId,
}: {
  session?: Session | null;
  postId: string;
}): Promise<Comment[]> => {
  return apiFetch<Comment[]>(`/api/posts/${postId}/comments`, {}, session);
};

export const createComment = async ({
  session,
  postId,
  body,
  parentId,
}: {
  session: Session;
  postId: string;
  body: string;
  parentId?: string | null;
}): Promise<Comment> => {
  return apiFetch<Comment>(
    `/api/posts/${postId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({ body, parentId: parentId ?? null }),
    },
    session,
  );
};

export const updateComment = async ({
  session,
  commentId,
  body,
}: {
  session: Session;
  commentId: string;
  body: string;
}): Promise<Comment> => {
  return apiFetch<Comment>(
    `/api/posts/comments/${commentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ body }),
    },
    session,
  );
};

export const deleteComment = async ({
  session,
  commentId,
}: {
  session: Session;
  commentId: string;
}): Promise<void> => {
  return apiFetch<void>(
    `/api/posts/comments/${commentId}`,
    { method: 'DELETE' },
    session,
  );
};
