"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  PenLine,
  Blend,
  Tag,
  Users,
  LogOut,
  User,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/utils/supabase/client";
import { getAvatarUrl } from "@/lib/postUtils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AppNavbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const isSuperAdmin = role === "super_admin";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName =
    user?.user_metadata?.full_name ?? user?.email?.split("@")[0];

  return (
    <nav className="navbar px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="navbar-shell px-5 py-4 bg-white/30 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl">
          <Link href="/" className="navbar-brand group flex items-center gap-3">
            <div className="navbar-logo-badge transition-transform group-hover:scale-110">
              <Blend className="h-4 w-4" />
            </div>
            <span className="navbar-brand-text hidden font-serif font-black tracking-tighter sm:block">
              K-SPACE CMS
            </span>
          </Link>

          <div className="navbar-actions flex items-center gap-3">
            {mounted && user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/write")}
                  className="navbar-cta group relative overflow-hidden "
                >
                  <PenLine className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                  <span className="font-bold ">Write</span>
                </button>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/20 transition-all hover:border-white/50 focus:outline-none">
                      <Image
                        src={getAvatarUrl(user)}
                        alt="avatar"
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-64 overflow-hidden rounded-4xl border-(--border-default) bg-(--surface) p-2 shadow-2xl backdrop-blur-2xl"
                  >
                    <div className="px-4 py-3 mb-2 border-b border-(--border-default) opacity-80">
                      <p className="text-xs font-black uppercase tracking-widest truncate">
                        {displayName}
                      </p>
                      <p className="text-[10px] text-(--muted) truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="grid gap-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-(--canvas-subtle)"
                      >
                        <User className="h-4 w-4 opacity-70" />
                        <span>My Profile</span>
                      </Link>

                      {isSuperAdmin && (
                        <>
                          <div className="my-1 border-t border-(--border-default) opacity-30" />
                          <div className="px-3 py-1 text-[10px] font-bold text-(--muted) uppercase tracking-tight">
                            Admin Console
                          </div>
                          <Link
                            href="/admin/users"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-(--canvas-subtle)"
                          >
                            <Users className="h-4 w-4 text-blue-500" />
                            <span>Manage Users</span>
                          </Link>
                          <Link
                            href="/admin/tags"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-(--canvas-subtle)"
                          >
                            <Tag className="h-4 w-4 text-purple-500" />
                            <span>Manage Tags</span>
                          </Link>
                        </>
                      )}

                      <div className="my-1 border-t border-(--border-default) opacity-50" />
                      <ThemeToggle className="navbar-theme-toggle" />
                      <button
                        onClick={() => void handleSignOut()}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-(--danger) transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="navbar-cta font-bold">
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
