import CryptoJS from 'crypto-js';

const SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET ?? 'k-space-cms-secret';

/**
 * Encrypt password with AES before sending to Supabase.
 * Used only for email-based auth (not OAuth).
 */
export function encryptPassword(plain: string): string {
  return CryptoJS.AES.encrypt(plain, SECRET).toString();
}
