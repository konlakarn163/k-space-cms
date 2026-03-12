import { Router } from 'express';
import {
  createCommentController,
  createPostController,
  deleteCommentController,
  deletePostController,
  getPostController,
  listCommentsController,
  listPostsController,
  listTagsController,
  updateCommentController,
  updatePostController,
  voteController,
} from '../controllers/postController.js';
import { requireAuth } from '../middleware/auth.js';

const postRoutes = Router();

postRoutes.get('/', listPostsController);
postRoutes.get('/tags', listTagsController);
postRoutes.get('/:postId', getPostController);
postRoutes.post('/', requireAuth, createPostController);
postRoutes.patch('/:postId', requireAuth, updatePostController);
postRoutes.delete('/:postId', requireAuth, deletePostController);

postRoutes.get('/:postId/comments', listCommentsController);
postRoutes.post('/:postId/comments', requireAuth, createCommentController);
postRoutes.patch('/comments/:commentId', requireAuth, updateCommentController);
postRoutes.delete('/comments/:commentId', requireAuth, deleteCommentController);

postRoutes.post('/:postId/vote', requireAuth, voteController);

export default postRoutes;
