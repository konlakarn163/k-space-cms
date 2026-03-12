import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import UserManager from '@/components/features/users/UserManager';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'super_admin') {
    redirect('/');
  }

  return <UserManager session={session} />;
}
