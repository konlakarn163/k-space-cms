import type { Session } from '@supabase/supabase-js';
import { apiFetch } from '@/lib/api';
import type { Profile } from '@/lib/types';

export const fetchMyProfile = async (session: Session): Promise<Profile> => {
  return apiFetch<Profile>('/api/profile/me', undefined, session);
};

export const updateMyProfile = async (
  session: Session,
  data: { username?: string; avatarUrl?: string },
): Promise<Profile> => {
  return apiFetch<Profile>(
    '/api/profile/me',
    { method: 'PUT', body: JSON.stringify(data) },
    session,
  );
};

export const changeMyPassword = async (
  session: Session,
  newPassword: string,
): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>(
    '/api/profile/change-password',
    { method: 'POST', body: JSON.stringify({ newPassword }) },
    session,
  );
};
