import { Router } from 'express';
import { listUsersController, updateUserRoleController } from '../controllers/adminUserController.js';
import { requireAuth, requireSuperAdmin } from '../middleware/auth.js';

const adminRoutes = Router();

adminRoutes.use(requireAuth, requireSuperAdmin);
adminRoutes.get('/users', listUsersController);
adminRoutes.patch('/users/:id/role', updateUserRoleController);

export default adminRoutes;
