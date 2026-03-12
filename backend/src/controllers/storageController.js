import { uploadImageByUser } from '../services/storageService.js';
import { handleApiError } from '../utils/errors.js';

export const uploadImageController = async (req, res) => {
  try {
    const data = await uploadImageByUser({
      userId: req.user.id,
      payload: req.body,
    });

    return res.status(201).json(data);
  } catch (error) {
    return handleApiError(res, error, 'Cannot upload image');
  }
};
