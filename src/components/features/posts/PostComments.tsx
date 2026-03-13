'use client';

import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import type { Comment } from '@/lib/types';
import { Input } from '@/components/ui/input';

type PostCommentsProps = {
  comments: Comment[];
  commentInput: string;
  loading: boolean;
  myId?: string;
  rootComments: Comment[];
  user: User | null;
  onCommentChange: (value: string) => void;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, body: string) => Promise<void>;
  onSubmitComment: () => void;
};

export default function PostComments({
  comments,
  commentInput,
  loading,
  myId,
  rootComments,
  user,
  onCommentChange,
  onDeleteComment,
  onEditComment,
  onSubmitComment,
}: PostCommentsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBody, setEditingBody] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditingBody(comment.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingBody('');
  };

  const submitEdit = async (commentId: string) => {
    const nextBody = editingBody.trim();
    if (!nextBody || savingEdit) return;

    setSavingEdit(true);
    try {
      await onEditComment(commentId, nextBody);
      cancelEdit();
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <p className="theme-muted text-xs uppercase tracking-[0.24em]">Conversation</p>
        <h2 className="font-serif mt-2 text-3xl font-bold">Comments</h2>
      </div>

      <div className="space-y-4">
        {loading ? <p className="theme-muted text-sm">Loading comments…</p> : null}

        {rootComments.length === 0 && !loading ? (
          <div className="theme-card rounded-md border p-6">
            <p className="theme-muted text-sm">No comments yet. Start the conversation.</p>
          </div>
        ) : null}

        {rootComments.map((comment) => {
          const isMine = comment.user_id === myId;
          const replies = comments.filter((item) => item.parent_id === comment.id);
          const isEditing = editingId === comment.id;

          return (
            <article key={comment.id} className="theme-card rounded-md border p-5">
              <div className="flex items-start justify-between gap-3">
                <div className='flex-1'>
                  <p className="text-sm font-semibold">{comment.profiles?.username ?? 'member'}</p>
                  {isEditing ? (
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <Input
                        value={editingBody}
                        onChange={(event) => setEditingBody(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            void submitEdit(comment.id);
                          }

                          if (event.key === 'Escape') {
                            cancelEdit();
                          }
                        }}
                        className="h-11 flex-1 rounded-full px-4 text-sm"
                        autoFocus
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void submitEdit(comment.id)}
                          disabled={savingEdit || !editingBody.trim()}
                          className="theme-secondary-button rounded-full p-2"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={cancelEdit} className="theme-secondary-button rounded-full p-2">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="theme-muted mt-2 text-sm leading-7">{comment.body}</p>
                  )}
                </div>

                {isMine ? (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEdit(comment)} className="theme-secondary-button rounded-full p-2" disabled={isEditing}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onDeleteComment(comment.id)} className="theme-secondary-button theme-danger rounded-full p-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>

              {replies.length > 0 ? (
                <div className="mt-4 space-y-3 border-l pl-4 theme-border">
                  {replies.map((reply) => (
                    <div key={reply.id} className="theme-elevated rounded-2xl border p-4 theme-border">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em]">{reply.profiles?.username ?? 'member'}</p>
                      <p className="theme-muted mt-2 text-sm leading-7">{reply.body}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {user ? (
        <div className="theme-card rounded-md border p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={commentInput}
              onChange={(event) => onCommentChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  onSubmitComment();
                }
              }}
              placeholder="Write a thoughtful response..."
              className="h-12 flex-1 rounded-full px-5 py-3 text-sm"
            />
            <button type="button" onClick={onSubmitComment} className="theme-primary-button rounded-full px-5 py-3 text-sm font-semibold">
              Add comment
            </button>
          </div>
        </div>
      ) : (
        <p className="theme-muted text-sm">
          <a href="/login" className="underline" style={{ color: 'var(--accent)' }}>Sign in</a> to join the conversation.
        </p>
      )}
    </section>
  );
}
