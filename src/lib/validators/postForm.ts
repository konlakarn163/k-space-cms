import { z } from 'zod';

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const stripEditorHtml = (value: string) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const postFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title must be at least 5 characters.')
    .max(120, 'Title must be 120 characters or less.'),
  content: z
    .string()
    .refine((value) => stripEditorHtml(value).length >= 20, 'Content must be at least 20 characters.'),
  tags: z
    .array(z.string().trim().min(1))
    .min(1, 'Select at least 1 tag.')
    .max(5, 'Select up to 5 tags.'),
  imageFile: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_IMAGE_SIZE_BYTES, `Cover image must be smaller than ${MAX_IMAGE_SIZE_MB} MB.`)
    .refine((file) => file.type.startsWith('image/'), 'Cover image must be an image file.')
    .optional()
    .nullable(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
