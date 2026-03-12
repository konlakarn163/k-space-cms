import { apiFetch } from '@/lib/api';
import type { Session } from '@supabase/supabase-js';

export type MasterTag = {
  id: string;
  name: string;
  created_at: string;
};

export const fetchTags = async ({ session }: { session?: Session | null } = {}): Promise<MasterTag[]> => {
  try {
    return await apiFetch<MasterTag[]>('/api/tags', {}, session);
  } catch {
    return [];
  }
};

export const createTag = async ({
  name,
  session,
}: {
  name: string;
  session: Session;
}): Promise<MasterTag> => {
  return apiFetch<MasterTag>('/api/tags', { method: 'POST', body: JSON.stringify({ name }) }, session);
};

export const updateTag = async ({
  id,
  name,
  session,
}: {
  id: string;
  name: string;
  session: Session;
}): Promise<MasterTag> => {
  return apiFetch<MasterTag>(`/api/tags/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }, session);
};

export const deleteTag = async ({ id, session }: { id: string; session: Session }): Promise<void> => {
  return apiFetch<void>(`/api/tags/${id}`, { method: 'DELETE' }, session);
};
