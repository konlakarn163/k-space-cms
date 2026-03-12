import { getMyProfile, syncProfileForUser, updateProfile, changePassword } from '../services/profileService.js';
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

export const updateProfileController = async (req, res) => {
  try {
    const { username, avatarUrl } = req.body;
    const profile = await updateProfile({
      accessToken: req.accessToken,
      userId: req.user.id,
      username,
      avatarUrl,
    });
    return res.json(profile);
  } catch (error) {
    return handleApiError(res, error, 'Cannot update profile');
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const provider = req.user.app_metadata?.provider;
    if (provider && provider !== 'email') {
      return res.status(400).json({ message: 'Password change is not available for social login accounts.' });
    }
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    await changePassword({ userId: req.user.id, newPassword });
    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    return handleApiError(res, error, 'Cannot change password');
  }
};
