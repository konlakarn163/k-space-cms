import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import WritePostContent from '@/components/features/write/WritePostContent';
import { createClient } from '@/utils/supabase/server';

export default async function WritePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <WritePostContent user={user as User} mode="create" />;
}
