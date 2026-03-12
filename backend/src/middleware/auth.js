import { supabaseAdmin } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  const rawAuth = req.headers.authorization;

  if (!rawAuth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing bearer token' });
  }

  const accessToken = rawAuth.slice('Bearer '.length);
  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);

  if (error || !data.user) {
    return res.status(401).json({ message: 'Invalid access token' });
  }

  req.user = data.user;
  req.accessToken = accessToken;
  next();
};

export const requireSuperAdmin = async (req, res, next) => {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();

  if (error || !data || data.role !== 'super_admin') {
    return res.status(403).json({ message: 'Super admin only' });
  }

  next();
};
