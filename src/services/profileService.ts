import type { Session } from '@supabase/supabase-js';
import { apiFetch } from '@/lib/api';
import type { Profile } from '@/lib/types';

export const fetchMyProfile = async (session: Session): Promise<Profile> => {
  return apiFetch<Profile>('/api/profile/me', undefined, session);
};
