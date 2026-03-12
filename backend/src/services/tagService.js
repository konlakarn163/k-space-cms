import { z } from 'zod';
import { supabaseAdmin } from '../config/supabase.js';

const tagSchema = z.object({ name: z.string().trim().min(1).max(40) });

export const listMasterTags = async () => {
  const { data, error } = await supabaseAdmin
    .from('master_tags')
    .select('id, name, created_at')
    .order('name', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const createMasterTag = async ({ name }) => {
  const input = tagSchema.parse({ name });

  const { data, error } = await supabaseAdmin
    .from('master_tags')
    .insert({ name: input.name })
    .select('id, name, created_at')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateMasterTag = async ({ id, name }) => {
  const input = tagSchema.parse({ name });

  const { data, error } = await supabaseAdmin
    .from('master_tags')
    .update({ name: input.name })
    .eq('id', id)
    .select('id, name, created_at')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteMasterTag = async ({ id }) => {
  const { error } = await supabaseAdmin.from('master_tags').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
