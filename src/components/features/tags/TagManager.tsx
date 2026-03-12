"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import {
  createTag,
  deleteTag,
  fetchTags,
  updateTag,
  type MasterTag,
} from "@/services/tagService";
import { Input } from "@/components/ui/input";

export default function TagManager({ session }: { session: Session }) {
  const [tags, setTags] = useState<MasterTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const result = await fetchTags({ session });
      setTags(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const tag = await createTag({ name: newName.trim(), session });
      setTags((prev) =>
        [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setNewName("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create tag");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    setError("");
    try {
      const updated = await updateTag({
        id,
        name: editingName.trim(),
        session,
      });
      setTags((prev) =>
        prev
          .map((t) => (t.id === id ? updated : t))
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
      setEditingId(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update tag");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag?")) return;
    setError("");
    try {
      await deleteTag({ id, session });
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete tag");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="pb-4">
        <h1 className="font-serif text-4xl font-black tracking-tight text-[var(--foreground)]">
          Tag Management
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Manage tags for your community.
        </p>
      </div>
      <div className="theme-card rounded-2xl border p-5 mb-6">
        <p className="theme-muted text-xs uppercase tracking-widest mb-3">
          Add new tag
        </p>
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
            }}
            placeholder="Tag name…"
            className="h-10 flex-1 rounded-xl px-4 py-2 text-sm"
          />
          <button
            onClick={() => void handleCreate()}
            disabled={creating || !newName.trim()}
            className="navbar-cta gap-2 px-5"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        {error ? (
          <p className="mt-2 text-xs text-[var(--danger)]">{error}</p>
        ) : null}
      </div>

      {/* List */}
      <div className="theme-card rounded-2xl border p-5">
        <p className="theme-muted text-xs uppercase tracking-widest mb-4">
          {loading
            ? "Loading…"
            : `${tags.length} tag${tags.length !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-11 rounded-xl theme-elevated" />
            ))}
          </div>
        ) : tags.length === 0 ? (
          <p className="theme-muted text-sm text-center py-6">
            No tags yet. Add one above.
          </p>
        ) : (
          <div className="space-y-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-3 rounded-xl border px-4 py-2.5 theme-border"
              >
                {editingId === tag.id ? (
                  <>
                    <Input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleUpdate(tag.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="h-9 flex-1 border-0 bg-transparent px-0 py-0 text-sm"
                    />
                    <button
                      onClick={() => void handleUpdate(tag.id)}
                      className="text-[var(--success)] hover:opacity-70"
                      title="Save"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="theme-muted hover:opacity-70"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium">
                      {tag.name}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(tag.id);
                        setEditingName(tag.name);
                      }}
                      className="theme-muted hover:text-[var(--foreground)] transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => void handleDelete(tag.id)}
                      className="text-[var(--danger)] opacity-60 hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
