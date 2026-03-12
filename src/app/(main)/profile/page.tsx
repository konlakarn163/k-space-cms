import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import ProfileContent from '@/components/features/profile/ProfileContent';

export const metadata = { title: 'My Profile – K-Space CMS' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return <ProfileContent user={user} />;
}
