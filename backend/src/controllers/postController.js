import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getPostById,
  listCommentsByPost,
  listPosts,
  listTags,
  updateComment,
  updatePost,
  upsertVote,
} from '../services/postService.js';
import { handleApiError } from '../utils/errors.js';

export const listPostsController = async (req, res) => {
  try {
    const result = await listPosts({
      accessToken: req.accessToken,
      limit: Number(req.query.limit ?? 8),
      cursor: req.query.cursor ? String(req.query.cursor) : null,
      query: req.query.query ? String(req.query.query) : '',
      tag: req.query.tag ? String(req.query.tag) : '',
    });

    return res.json(result);
  } catch (error) {
    return handleApiError(res, error, 'Cannot load posts');
  }
};

export const getPostController = async (req, res) => {
  try {
    const result = await getPostById({
      accessToken: req.accessToken,
      postId: req.params.postId,
    });

    return res.json(result);
  } catch (error) {
    return handleApiError(res, error, 'Cannot load post');
  }
};

export const createPostController = async (req, res) => {
  try {
    const data = await createPost({
      accessToken: req.accessToken,
      userId: req.user.id,
      payload: req.body,
    });

    return res.status(201).json(data);
  } catch (error) {
    return handleApiError(res, error, 'Cannot create post');
  }
};

export const updatePostController = async (req, res) => {
  try {
    const data = await updatePost({
      accessToken: req.accessToken,
      postId: req.params.postId,
      payload: req.body,
    });

    return res.json(data);
  } catch (error) {
    return handleApiError(res, error, 'Cannot update post');
  }
};

export const deletePostController = async (req, res) => {
  try {
    await deletePost({
      accessToken: req.accessToken,
      postId: req.params.postId,
    });

    return res.status(204).send();
  } catch (error) {
    return handleApiError(res, error, 'Cannot delete post');
  }
};

export const listCommentsController = async (req, res) => {
  try {
    const data = await listCommentsByPost({
      accessToken: req.accessToken,
      postId: req.params.postId,
    });

    return res.json(data);
  } catch (error) {
    return handleApiError(res, error, 'Cannot load comments');
  }
};

export const createCommentController = async (req, res) => {
  try {
    const data = await createComment({
      accessToken: req.accessToken,
      userId: req.user.id,
      postId: req.params.postId,
      payload: req.body,
    });

    return res.status(201).json(data);
  } catch (error) {
    return handleApiError(res, error, 'Cannot create comment');
  }
};

export const updateCommentController = async (req, res) => {
  try {
    const data = await updateComment({
      accessToken: req.accessToken,
      commentId: req.params.commentId,
      payload: req.body,
    });

    return res.json(data);
  } catch (error) {
    return handleApiError(res, error, 'Cannot update comment');
  }
};

export const deleteCommentController = async (req, res) => {
  try {
    await deleteComment({
      accessToken: req.accessToken,
      commentId: req.params.commentId,
    });

    return res.status(204).send();
  } catch (error) {
    return handleApiError(res, error, 'Cannot delete comment');
  }
};

export const voteController = async (req, res) => {
  try {
    const data = await upsertVote({
      accessToken: req.accessToken,
      userId: req.user.id,
      postId: req.params.postId,
      payload: req.body,
    });

    return res.json(data);
  } catch (error) {
    return handleApiError(res, error, 'Cannot vote this post');
  }
};

export const listTagsController = async (req, res) => {
  try {
    const tags = await listTags({ accessToken: req.accessToken });
    return res.json(tags);
  } catch (error) {
    return handleApiError(res, error, 'Cannot load tags');
  }
};
