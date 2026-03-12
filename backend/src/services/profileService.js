import { createSupabaseRlsClient } from '../config/supabase.js';

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
