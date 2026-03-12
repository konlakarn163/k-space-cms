import { z } from 'zod';
import { createSupabaseRlsClient } from '../config/supabase.js';

const postPayloadSchema = z.object({
  title: z.string().min(3).max(180),
  content: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(30)).max(10).optional().default([]),
});

const commentPayloadSchema = z.object({
  body: z.string().min(1).max(4000),
  parentId: z.string().uuid().nullable().optional(),
});

const votePayloadSchema = z.object({
  voteType: z.enum(['up', 'down', 'none']),
});

export const listPosts = async ({ accessToken, limit, cursor, query, tag }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  let request = supabase
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      image_url,
      tags,
      created_at,
      author_id,
      profiles:profiles!posts_author_id_fkey(id, username, avatar_url),
      comments(count),
      votes(vote_type, user_id)
    `,
    )
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    request = request.lt('created_at', cursor);
  }

  if (query) {
    request = request.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
  }

  if (tag) {
    request = request.contains('tags', [tag]);
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []).slice(0, limit);
  const hasMore = (data ?? []).length > limit;

  return {
    posts: items,
    nextCursor: hasMore ? items[items.length - 1].created_at : null,
    hasMore,
  };
};

export const getPostById = async ({ accessToken, postId }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      content,
      image_url,
      tags,
      created_at,
      author_id,
      profiles:profiles!posts_author_id_fkey(id, username, avatar_url),
      comments(count),
      votes(vote_type, user_id)
    `,
    )
    .eq('id', postId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createPost = async ({ accessToken, userId, payload }) => {
  const input = postPayloadSchema.parse(payload);
  const supabase = createSupabaseRlsClient(accessToken);

  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: userId,
      title: input.title,
      content: input.content,
      image_url: input.imageUrl ?? null,
      tags: input.tags,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updatePost = async ({ accessToken, postId, payload }) => {
  const input = postPayloadSchema.partial().parse(payload);
  const supabase = createSupabaseRlsClient(accessToken);

  const updatePayload = {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.content !== undefined ? { content: input.content } : {}),
    ...(input.imageUrl !== undefined ? { image_url: input.imageUrl } : {}),
    ...(input.tags !== undefined ? { tags: input.tags } : {}),
  };

  const { data, error } = await supabase
    .from('posts')
    .update(updatePayload)
    .eq('id', postId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deletePost = async ({ accessToken, postId }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    throw new Error(error.message);
  }
};

export const listCommentsByPost = async ({ accessToken, postId }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  const { data, error } = await supabase
    .from('comments')
    .select(
      `
      id,
      post_id,
      user_id,
      body,
      parent_id,
      created_at,
      profiles:profiles!comments_user_id_fkey(id, username, avatar_url)
    `,
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};

export const createComment = async ({ accessToken, userId, postId, payload }) => {
  const input = commentPayloadSchema.parse(payload);
  const supabase = createSupabaseRlsClient(accessToken);

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      body: input.body,
      parent_id: input.parentId ?? null,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateComment = async ({ accessToken, commentId, payload }) => {
  const input = commentPayloadSchema.partial().parse(payload);
  const supabase = createSupabaseRlsClient(accessToken);

  const { data, error } = await supabase
    .from('comments')
    .update({
      ...(input.body !== undefined ? { body: input.body } : {}),
      ...(input.parentId !== undefined ? { parent_id: input.parentId } : {}),
    })
    .eq('id', commentId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteComment = async ({ accessToken, commentId }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  const { error } = await supabase.from('comments').delete().eq('id', commentId);

  if (error) {
    throw new Error(error.message);
  }
};

export const upsertVote = async ({ accessToken, userId, postId, payload }) => {
  const input = votePayloadSchema.parse(payload);
  const supabase = createSupabaseRlsClient(accessToken);

  if (input.voteType === 'none') {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) {
      throw new Error(error.message);
    }
    return { voteType: 'none' };
  }

  const { data, error } = await supabase
    .from('votes')
    .upsert(
      {
        post_id: postId,
        user_id: userId,
        vote_type: input.voteType,
      },
      { onConflict: 'post_id,user_id' },
    )
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const listTags = async ({ accessToken }) => {
  const supabase = createSupabaseRlsClient(accessToken);
  const { data, error } = await supabase
    .from('posts')
    .select('tags')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    throw new Error(error.message);
  }

  const tags = Array.from(
    new Set(
      (data ?? [])
        .flatMap((row) => row.tags ?? [])
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

  return tags;
};
