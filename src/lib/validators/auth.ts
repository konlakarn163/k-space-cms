import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
  .regex(/[A-Z]/, 'รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')
  .regex(/\d/, 'รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว');

export const signupSchema = z.object({
  email: z.string().trim().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: passwordSchema,
});
