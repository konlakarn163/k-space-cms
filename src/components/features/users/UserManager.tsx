'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { AdminUser } from '@/services/adminUserService';
import { fetchAdminUsers, updateAdminUserRole } from '@/services/adminUserService';
import { Loader2, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ROLE_OPTIONS: AdminUser['role'][] = ['member', 'admin', 'super_admin'];

export default function UserManager({ session }: { session: Session }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAdminUsers({ session });
      setUsers(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleRoleChange = async (id: string, role: AdminUser['role']) => {
    setSavingId(id);
    setError('');
    try {
      const updated = await updateAdminUserRole({ id, role, session });
      setUsers((prev) => prev.map((user) => (user.id === id ? updated : user)));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-black tracking-tight text-[var(--foreground)]">
            User Management
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Manage permissions and roles for your community members.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--foreground)] text-[var(--background)] shadow-lg">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2rem]  bg-[var(--surface)] p-2  dark:bg-[rgba(23,23,28,0.6)]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              {loading ? 'Syncing...' : `${users.length} Active Members`}
            </span>
          </div>
          {error && (
            <div className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold text-red-500 border border-red-500/20">
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-[var(--canvas-subtle)]/50" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="mb-4 h-12 w-12 opacity-10" />
            <p className="text-sm font-medium text-[var(--muted)]">No users found in database.</p>
          </div>
        ) : (
          <div className="grid gap-3 p-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4 transition-all hover:border-[var(--muted)] hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--canvas-subtle)] font-serif text-lg font-bold text-[var(--foreground)] group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] transition-colors">
                    {user.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold tracking-tight text-[var(--foreground)]">
                      {user.username}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)] uppercase tracking-tighter">
                      <span className="truncate max-w-[120px] sm:max-w-none">{user.id}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-44">
                  <Select
                    value={user.role}
                    onValueChange={(value) => void handleRoleChange(user.id, value as AdminUser['role'])}
                    disabled={savingId === user.id}
                  >
                    <SelectTrigger className="w-full rounded-xl text-xs font-bold">
                      {savingId === user.id ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <SelectValue placeholder="Select role" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}