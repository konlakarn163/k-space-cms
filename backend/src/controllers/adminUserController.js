import { handleApiError } from '../utils/errors.js';
import { listUsers, updateUserRole } from '../services/adminUserService.js';

export const listUsersController = async (_req, res) => {
  try {
    const users = await listUsers();
    return res.json(users);
  } catch (error) {
    return handleApiError(res, error, 'Cannot load users');
  }
};

export const updateUserRoleController = async (req, res) => {
  try {
    const user = await updateUserRole({
      userId: req.params.id,
      role: req.body.role,
      actorId: req.user.id,
    });

    return res.json(user);
  } catch (error) {
    return handleApiError(res, error, 'Cannot update role');
  }
};
