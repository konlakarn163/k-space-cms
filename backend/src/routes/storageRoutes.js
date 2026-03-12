import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadImageController } from '../controllers/storageController.js';

const storageRoutes = Router();

storageRoutes.post('/upload', requireAuth, uploadImageController);

export default storageRoutes;
