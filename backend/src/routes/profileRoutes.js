import { Router } from 'express';
import { myProfileController, syncMyProfileController, updateProfileController, changePasswordController } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';

const profileRoutes = Router();

profileRoutes.get('/me', requireAuth, myProfileController);
profileRoutes.post('/sync', requireAuth, syncMyProfileController);
profileRoutes.put('/me', requireAuth, updateProfileController);
profileRoutes.post('/change-password', requireAuth, changePasswordController);

export default profileRoutes;
