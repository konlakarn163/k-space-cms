import CryptoJS from 'crypto-js';

const SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET ?? 'k-space-cms-secret';

export function encryptPassword(plain: string): string {
  return CryptoJS.AES.encrypt(plain, SECRET).toString();
}
