import { supabaseAdmin } from '../config/supabase.js';

export const checkEmailExists = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.users.some((user) => user.email?.toLowerCase() === normalizedEmail);
};
