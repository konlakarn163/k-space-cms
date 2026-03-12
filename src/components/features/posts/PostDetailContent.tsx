'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Session, User } from '@supabase/supabase-js';
import { ArrowBigDown, ArrowBigUp, ArrowLeft, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import type { Comment, Post } from '@/lib/types';
import PostComments from '@/components/features/posts/PostComments';
import {
  createComment,
  deleteComment,
  updateComment,
  fetchComments,
} from '@/services/commentService';
import { deletePost } from '@/services/postService';
import { castVote } from '@/services/voteService';
import { formatDate, getCommentCount, getVoteScore } from '@/lib/postUtils';
import { supabase } from '@/utils/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type PostDetailContentProps = {
  initialPost: Post;
  user: User | null;
};

export default function PostDetailContent({ initialPost, user }: PostDetailContentProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [post, setPost] = useState<Post>(initialPost);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const myId = user?.id;

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    void initSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoadingComments(true);
      try {
        const result = await fetchComments({ session, postId: initialPost.id });
        setComments(result);
      } finally {
        setLoadingComments(false);
      }
    };

    void load();
  }, [initialPost.id, session]);

  const rootComments = useMemo(() => comments.filter((comment) => !comment.parent_id), [comments]);

  const handleVote = async (nextType: 'up' | 'down') => {
    if (!session || !myId) return;

    const currentVote = (post.votes ?? []).find((vote) => vote.user_id === myId)?.vote_type;
    const voteType = currentVote === nextType ? 'none' : nextType;

    setPost((prev) => {
      const withoutMine = (prev.votes ?? []).filter((vote) => vote.user_id !== myId);
      return {
        ...prev,
        votes: voteType === 'none' ? withoutMine : [...withoutMine, { vote_type: voteType as 'up' | 'down', user_id: myId }],
      };
    });

    try {
      await castVote({ session, postId: post.id, voteType });
    } catch {
      setPost(initialPost);
    }
  };

  const handleDeletePost = async () => {
    if (!session) return;

    try {
      await deletePost({ session, postId: post.id });
      setDeleteDialogOpen(false);
      router.push('/');
      router.refresh();
    } catch {
      window.alert('Cannot delete post');
    }
  };

  const handleCreateComment = async () => {
    if (!session || !myId || !commentInput.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic: Comment = {
      id: tempId,
      post_id: post.id,
      user_id: myId,
      body: commentInput.trim(),
      parent_id: null,
      created_at: new Date().toISOString(),
      profiles: {
        id: myId,
        username: user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'member',
        avatar_url: user?.user_metadata?.avatar_url ?? null,
        role: 'member',
        updated_at: new Date().toISOString(),
      },
    };

    setComments((prev) => [...prev, optimistic]);
    setCommentInput('');
    setPost((prev) => ({ ...prev, comments: [{ count: getCommentCount(prev) + 1 }] }));

    try {
      const created = await createComment({ session, postId: post.id, body: optimistic.body });
      setComments((prev) => prev.map((comment) => (comment.id === tempId ? created : comment)));
    } catch {
      setComments((prev) => prev.filter((comment) => comment.id !== tempId));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!session) return;
    const snapshot = comments;
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));

    try {
      await deleteComment({ session, commentId });
    } catch {
      setComments(snapshot);
    }
  };

  const handleEditComment = async (commentId: string, body: string) => {
    if (!session) return;
    const nextBody = window.prompt('Edit comment', body);
    if (!nextBody) return;

    const snapshot = comments;
    setComments((prev) => prev.map((comment) => (comment.id === commentId ? { ...comment, body: nextBody } : comment)));

    try {
      await updateComment({ session, commentId, body: nextBody });
    } catch {
      setComments(snapshot);
    }
  };

  const myVote = (post.votes ?? []).find((vote) => vote.user_id === myId)?.vote_type;

  return (
    <div className="theme-canvas min-h-screen">
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="theme-secondary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          {post.author_id === myId ? (
            <div className="flex items-center gap-2">
              <Link href={`/write/${post.id}`} className="theme-secondary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                <Pencil className="h-4 w-4" /> Edit
              </Link>
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <button type="button" className="theme-secondary-button theme-danger inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete this article?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. The post and related data will be permanently removed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <button
                      type="button"
                      onClick={() => setDeleteDialogOpen(false)}
                      className="theme-secondary-button inline-flex items-center rounded-full px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeletePost()}
                      className="theme-secondary-button theme-danger inline-flex items-center rounded-2xl px-4 py-2 text-sm text-red-600 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : null}
        </div>

        <article className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span key={`${post.id}-${tag}`} className="tag-chip">{tag}</span>
            ))}
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
            <div className="theme-muted flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.18em]">
              <span>{post.profiles?.username ?? 'member'}</span>
              <span>•</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>

          {post.image_url ? (
            <div className="relative aspect-video overflow-hidden rounded-4xl">
              <Image src={post.image_url} alt={post.title} fill className="object-cover" sizes="(max-width: 1200px) 100vw, 1200px" />
            </div>
          ) : null}

          <div className="theme-border flex flex-wrap items-center gap-3 border-y py-4">
            <button type="button" onClick={() => void handleVote('up')} disabled={!user} className={`theme-secondary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${myVote === 'up' ? 'text-green-600' : ''}`}>
              <ArrowBigUp className="h-4 w-4" /> {getVoteScore(post)}
            </button>
            <button type="button" onClick={() => void handleVote('down')} disabled={!user} className={`theme-secondary-button rounded-full p-2 ${myVote === 'down' ? 'theme-danger' : ''}`}>
              <ArrowBigDown className="h-4 w-4" />
            </button>
            <span className="theme-muted inline-flex items-center gap-2 text-sm"><MessageCircle className="h-4 w-4" /> {getCommentCount(post)} comments</span>
          </div>

          <div className="theme-prose max-w-none text-base leading-8" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        <PostComments
          comments={comments}
          commentInput={commentInput}
          loading={loadingComments}
          myId={myId}
          rootComments={rootComments}
          user={user}
          onCommentChange={setCommentInput}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
          onSubmitComment={() => void handleCreateComment()}
        />
      </main>
    </div>
  );
}
