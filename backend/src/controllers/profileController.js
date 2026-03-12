import { getMyProfile, syncProfileForUser } from '../services/profileService.js';
import { handleApiError } from '../utils/errors.js';

export const syncMyProfileController = async (req, res) => {
  try {
    const profile = await syncProfileForUser({
      accessToken: req.accessToken,
      user: req.user,
    });

    return res.json(profile);
  } catch (error) {
    return handleApiError(res, error, 'Cannot sync profile');
  }
};

export const myProfileController = async (req, res) => {
  try {
    const profile = await getMyProfile({
      accessToken: req.accessToken,
      userId: req.user.id,
    });

    return res.json(profile);
  } catch (error) {
    return handleApiError(res, error, 'Cannot get profile');
  }
};
