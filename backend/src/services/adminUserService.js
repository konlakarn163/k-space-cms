import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';
import { withHttpError } from '../utils/errors.js';

const roleSchema = z.object({
  role: z.enum(['member', 'admin', 'super_admin']),
});

export const listUsers = async () => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, username, avatar_url, role, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const updateUserRole = async ({ userId, role, actorId }) => {
  const input = roleSchema.parse({ role });

  if (userId === actorId) {
    throw withHttpError('Cannot change your own role', 400);
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ role: input.role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('id, username, avatar_url, role, updated_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
