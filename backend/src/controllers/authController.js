import { z } from 'zod';
import { checkEmailExists } from '../services/authService.js';
import { handleApiError } from '../utils/errors.js';

const emailSchema = z.object({
  email: z.string().email(),
});

export const checkEmailController = async (req, res) => {
  try {
    const query = emailSchema.parse({ email: String(req.query.email ?? '') });
    const exists = await checkEmailExists(query.email);
    return res.json({ exists });
  } catch (error) {
    return handleApiError(res, error, 'Cannot validate email');
  }
};
