import { notFound, redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import WritePostContent from '@/components/features/write/WritePostContent';
import { fetchPostById } from '@/services/postService';
import { createClient } from '@/utils/supabase/server';

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  try {
    const post = await fetchPostById({ postId: id });

    if (post.author_id !== user.id) {
      redirect(`/posts/${id}`);
    }

    return <WritePostContent user={user as User} mode="edit" initialPost={post} />;
  } catch {
    notFound();
  }
}
