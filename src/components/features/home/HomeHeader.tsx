'use client';

import Image from 'next/image';
import type { User } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import OriginButton from '@/components/ui/OriginButton';
import { getAvatarUrl } from '@/lib/postUtils';

type HomeHeaderProps = {
  user: User | null;
  onSignOut: () => void;
  onWriteClick: () => void;
};

export default function HomeHeader({ user, onSignOut, onWriteClick }: HomeHeaderProps) {
  return (
    <header className="navbar">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="font-serif text-2xl font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
            K·Space
          </p>
          <p className="theme-muted text-xs uppercase tracking-[0.18em]">Editorial community CMS</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="rounded-full" />

          {user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border px-3 py-1.5 theme-surface theme-border sm:flex">
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image src={getAvatarUrl(user)} alt="avatar" fill className="object-cover" sizes="32px" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.user_metadata?.full_name ?? user.email?.split('@')[0]}</p>
                  <p className="theme-muted text-[11px] uppercase tracking-[0.16em]">Contributor</p>
                </div>
              </div>

              <div className="hidden sm:block">
                <OriginButton onClick={onWriteClick} className="px-5 py-2.5 text-sm" baseColor="#c0392b" hoverColor="#f8d6d1" iconHoverColor="#111827">
                  Write article
                </OriginButton>
              </div>

              <button
                type="button"
                onClick={onSignOut}
                className="theme-secondary-button rounded-full p-2"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <a href="/login" className="theme-primary-button rounded-full px-4 py-2 text-sm font-semibold">
              Sign in
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
