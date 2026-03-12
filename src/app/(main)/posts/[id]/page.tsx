import { notFound } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import PostDetailContent from '@/components/features/posts/PostDetailContent';
import { fetchPostById } from '@/services/postService';
import { createClient } from '@/utils/supabase/server';

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const post = await fetchPostById({ postId: id });
    return <PostDetailContent initialPost={post} user={user as User | null} />;
  } catch {
    notFound();
  }
}
