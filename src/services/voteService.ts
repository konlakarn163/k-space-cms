import { apiFetch } from '@/lib/api';
import type { Session } from '@supabase/supabase-js';

export type VoteType = 'up' | 'down' | 'none';

export const castVote = async ({
  session,
  postId,
  voteType,
}: {
  session: Session;
  postId: string;
  voteType: VoteType;
}): Promise<{ vote_type: VoteType }> => {
  return apiFetch<{ vote_type: VoteType }>(
    `/api/posts/${postId}/vote`,
    {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    },
    session,
  );
};
