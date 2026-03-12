import { z } from 'zod';
import { env } from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';
import { withHttpError } from '../utils/errors.js';

const uploadPayloadSchema = z.object({
  fileBase64: z.string().min(10),
  fileName: z.string().min(1).max(220),
  contentType: z.string().min(1).max(120),
  folder: z.enum(['covers', 'inline']).default('covers'),
});

const sanitizeFileName = (name) => {
  const clean = name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-');
  return clean.length > 120 ? clean.slice(0, 120) : clean;
};

export const uploadImageByUser = async ({ userId, payload }) => {
  const input = uploadPayloadSchema.parse(payload);

  if (!input.contentType.startsWith('image/')) {
    throw withHttpError('Only image uploads are allowed', 400);
  }

  let buffer;
  try {
    buffer = Buffer.from(input.fileBase64, 'base64');
  } catch {
    throw withHttpError('Invalid base64 payload', 400);
  }

  if (!buffer || buffer.length === 0) {
    throw withHttpError('Invalid image payload', 400);
  }

  if (buffer.length > 8 * 1024 * 1024) {
    throw withHttpError('Image is too large (max 8MB)', 413);
  }

  const timestamp = Date.now();
  const sanitizedName = sanitizeFileName(input.fileName);
  const ext = sanitizedName.includes('.') ? sanitizedName.split('.').pop() : 'jpg';
  const path = `${userId}/${input.folder}/${timestamp}-${sanitizedName.replace(/\.[^.]+$/, '')}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(env.storageBucket)
    .upload(path, buffer, {
      contentType: input.contentType,
      upsert: false,
    });

  if (error) {
    throw withHttpError(error.message, 400);
  }

  const { data } = supabaseAdmin.storage.from(env.storageBucket).getPublicUrl(path);

  return {
    publicUrl: data.publicUrl,
    path,
    bucket: env.storageBucket,
  };
};
