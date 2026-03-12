import type { Session } from '@supabase/supabase-js';
import { apiFetch } from '@/lib/api';

export type AdminUser = {
  id: string;
  username: string;
  avatar_url: string | null;
  role: 'member' | 'admin' | 'super_admin';
  updated_at: string;
};

export const fetchAdminUsers = async ({
  session,
}: {
  session: Session;
}): Promise<AdminUser[]> => {
  return apiFetch<AdminUser[]>('/api/admin/users', undefined, session);
};

export const updateAdminUserRole = async ({
  id,
  role,
  session,
}: {
  id: string;
  role: AdminUser['role'];
  session: Session;
}): Promise<AdminUser> => {
  return apiFetch<AdminUser>(
    `/api/admin/users/${id}/role`,
    {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    },
    session,
  );
};
