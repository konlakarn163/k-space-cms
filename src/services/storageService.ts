import { compressAndRenameImage } from '@/lib/imageUtils';
import { apiFetch } from '@/lib/api';
import type { Session } from '@supabase/supabase-js';

const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Failed to encode image'));
        return;
      }

      const [, base64] = result.split(',');
      if (!base64) {
        reject(new Error('Invalid image payload'));
        return;
      }

      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async ({
  session,
  file,
  folder = 'covers',
}: {
  session: Session;
  file: File;
  folder?: 'covers' | 'inline';
}): Promise<string> => {
  const compressed = await compressAndRenameImage(file);
  const fileBase64 = await toBase64(compressed);

  const response = await apiFetch<{ publicUrl: string }>(
    '/api/storage/upload',
    {
      method: 'POST',
      body: JSON.stringify({
        fileBase64,
        fileName: compressed.name,
        contentType: compressed.type || 'image/jpeg',
        folder,
      }),
    },
    session,
  );

  if (!response.publicUrl) {
    throw new Error('Upload failed: missing image URL');
  }

  return response.publicUrl;
};
