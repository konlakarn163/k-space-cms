import { createSupabaseRlsClient, supabaseAdmin } from '../config/supabase.js';

export const syncProfileForUser = async ({ accessToken, user }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  const username =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.user_metadata?.user_name ??
    user.email?.split('@')[0] ??
    'member';

  const avatarUrl =
    user.user_metadata?.avatar_url ??
    user.user_metadata?.picture ??
    null;

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        username,
        avatar_url: avatarUrl,
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getMyProfile = async ({ accessToken, userId }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateProfile = async ({ accessToken, userId, username, avatarUrl }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  const updateData = {};
  if (username !== undefined) updateData.username = username;
  if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const changePassword = async ({ userId, newPassword }) => {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (error) throw new Error(error.message);
};
