import { Router } from 'express';
import {
  createTagController,
  deleteTagController,
  listTagsController,
  updateTagController,
} from '../controllers/tagController.js';
import { requireAuth, requireSuperAdmin } from '../middleware/auth.js';

const tagRoutes = Router();

tagRoutes.get('/', listTagsController);
tagRoutes.post('/', requireAuth, requireSuperAdmin, createTagController);
tagRoutes.patch('/:id', requireAuth, requireSuperAdmin, updateTagController);
tagRoutes.delete('/:id', requireAuth, requireSuperAdmin, deleteTagController);

export default tagRoutes;
