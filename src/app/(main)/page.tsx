import { createClient } from '@/utils/supabase/server';
import HomeContent from '@/components/features/HomeContent';
import { User } from '@supabase/supabase-js';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <HomeContent user={user as User | null} />;
}