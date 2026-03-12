'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import { fetchMyProfile, updateMyProfile, changeMyPassword } from '@/services/profileService';
import { uploadImage } from '@/services/storageService';
import { encryptPassword } from '@/lib/cryptoUtils';
import { getAvatarUrl } from '@/lib/postUtils';
import type { Profile } from '@/lib/types';
import { KeyRound, Pencil, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ProfileContent({ user }: { user: User }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isEmailProvider = user.app_metadata?.provider === 'email';

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      try {
        const p = await fetchMyProfile(sessionData.session);
        setProfile(p);
        setUsername(p.username);
      } catch {
        // ignore
      }
    };
    void load();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setLoadingProfile(true);
    setProfileMsg(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('Not authenticated');

      let avatarUrl: string | undefined;
      if (avatarFile) {
        avatarUrl = await uploadImage({ session: sessionData.session, file: avatarFile, folder: 'covers' });
      }

      const updated = await updateMyProfile(sessionData.session, {
        username: username.trim() || undefined,
        avatarUrl,
      });
      setProfile(updated);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (e) {
      setProfileMsg({ type: 'error', text: e instanceof Error ? e.message : 'Failed to update profile.' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setLoadingPassword(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error('Not authenticated');
      const result = await changeMyPassword(sessionData.session, encryptPassword(newPassword));
      setPasswordMsg({ type: 'success', text: result.message });
      setNewPassword('');
      setConfirmPassword('');
    } catch (e) {
      setPasswordMsg({ type: 'error', text: e instanceof Error ? e.message : 'Failed to change password.' });
    } finally {
      setLoadingPassword(false);
    }
  };

  const displayAvatar = avatarPreview ?? profile?.avatar_url ?? getAvatarUrl(user);

  return (
    <div className="theme-canvas min-h-screen">
      <main className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6">
        <div>
          <h1 className="font-serif text-3xl font-bold">My Profile</h1>
          <p className="theme-muted mt-1 text-sm">Manage your account details</p>
        </div>

        {/* ── Profile Info ── */}
        <section className="theme-card rounded-2xl border p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <UserRound className="h-4 w-4 theme-muted" />
            <h2 className="font-semibold text-base">Profile Information</h2>
            {!isEmailProvider && (
              <span className="ml-auto text-xs theme-muted capitalize">
                via {user.app_metadata?.provider ?? 'social'}
              </span>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-(--border-default)">
              <Image src={displayAvatar} alt="avatar" fill className="object-cover" sizes="80px" />
            </div>
            {isEmailProvider ? (
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-(--border-default) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--canvas-subtle)">
                  <Pencil className="h-3.5 w-3.5" />
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
                <p className="theme-muted mt-1.5 text-xs">JPG, PNG or WebP (max 5 MB)</p>
              </div>
            ) : (
              <p className="text-sm theme-muted">Profile photo is managed by your sign-in provider.</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              disabled={!isEmailProvider}
            />
            {!isEmailProvider && (
              <p className="text-xs theme-muted">Username is synced from your sign-in provider.</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input value={user.email ?? ''} disabled />
          </div>

          {isEmailProvider && (
            <>
              {profileMsg && (
                <p className={`rounded-xl px-4 py-2.5 text-sm font-medium ${profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                  {profileMsg.text}
                </p>
              )}
              <button
                type="button"
                onClick={() => void handleSaveProfile()}
                disabled={loadingProfile}
                className="rounded-full bg-(--accent) px-6 py-2.5 text-sm font-bold text-(--accent-foreground) transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loadingProfile ? 'Saving…' : 'Save Changes'}
              </button>
            </>
          )}
        </section>

        {/* ── Change Password (email users only) ── */}
        {isEmailProvider && (
          <section className="theme-card rounded-2xl border p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <KeyRound className="h-4 w-4 theme-muted" />
              <h2 className="font-semibold text-base">Change Password</h2>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            {passwordMsg && (
              <p className={`rounded-xl px-4 py-2.5 text-sm font-medium ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                {passwordMsg.text}
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleChangePassword()}
              disabled={loadingPassword || !newPassword || !confirmPassword}
              className="rounded-full bg-(--accent) px-6 py-2.5 text-sm font-bold text-(--accent-foreground) transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loadingPassword ? 'Updating…' : 'Update Password'}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
