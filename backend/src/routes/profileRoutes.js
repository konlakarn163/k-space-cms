import { Router } from 'express';
import { myProfileController, syncMyProfileController } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';

const profileRoutes = Router();

profileRoutes.get('/me', requireAuth, myProfileController);
profileRoutes.post('/sync', requireAuth, syncMyProfileController);

export default profileRoutes;
