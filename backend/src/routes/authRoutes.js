import { Router } from 'express';
import { checkEmailController } from '../controllers/authController.js';

const authRoutes = Router();

authRoutes.get('/check-email', checkEmailController);

export default authRoutes;
