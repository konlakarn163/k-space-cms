"use client";

import { supabase } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import OriginButton from "@/components/ui/OriginButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setErrorMessage(null);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleEmailAuth = async () => {
    try {
      setLoading(true);
      setMessage(null);
      setErrorMessage(null);

      if (mode === "signup") {
        const checkResponse = await fetch(
          buildApiUrl("/api/auth/check-email", { email }),
        );
        const checkJson = (await checkResponse.json()) as { exists: boolean };

        if (checkJson.exists) {
          throw new Error("อีเมลนี้มีในระบบแล้ว กรุณาใช้ Sign in แทน");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        setMessage("สมัครสมาชิกสำเร็จ กรุณาเช็คอีเมลเพื่อยืนยันบัญชี");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push("/");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "ไม่สามารถดำเนินการได้",
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVars = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 font-sans transition-colors duration-500 dark:bg-[var(--background)]">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/5" />
      </div>

      <div className="absolute right-6 top-6 z-30">
        <ThemeToggle />
      </div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/70 p-8 shadow-2xl  transition-colors dark:border-slate-800/50 dark:bg-neutral-900/60 "
      >
        <div className="mb-10 text-center">
          {/* <motion.div
            variants={itemVars}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl dark:bg-slate-800"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-400 p-[2px]">
              <div className="h-full w-full rounded-[14px] bg-white dark:bg-slate-800" />
            </div>
          </motion.div> */}
          <motion.h1
            variants={itemVars}
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            K-Space{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              CMS
            </span>
          </motion.h1>
          <motion.p
            variants={itemVars}
            className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            Community platform
          </motion.p>
        </div>

        <div className="flex flex-col gap-5">
          <motion.div
            variants={itemVars}
            className="flex rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800/50"
          >
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
                mode === "signin"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
                mode === "signup"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Sign Up
            </button>
          </motion.div>

          <motion.div variants={itemVars} className="space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-13 w-full rounded-2xl border-slate-200 bg-white/50 px-5 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-13 w-full rounded-2xl border-slate-200 bg-white/50 px-5 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50"
            />
            <button
              onClick={handleEmailAuth}
              disabled={loading || !email || !password}
              className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <span className="relative z-10">
                {loading
                  ? "Processing..."
                  : mode === "signin"
                    ? "Sign in with Email"
                    : "Create Account"}
              </span>
            </button>
          </motion.div>

          {message && (
            <p className="rounded-xl bg-emerald-500/10 p-3 text-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {message}
            </p>
          )}
          {errorMessage && (
            <p className="rounded-xl bg-red-500/10 p-3 text-center text-xs font-medium text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              OR
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div variants={itemVars}>
              <OriginButton
                onClick={() => handleLogin("google")}
                bgColor="#e3e4e4"
                hoverColor="#e3e4e4"
                darkColor="#fff"
                darkHoverColor="#fff"
                darkIconColor="#000"
                darkIconHoverColor="#000"
                className="w-full !p-3"
              >
                <div className="flex items-center justify-center">
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    width={18}
                    height={18}
                    alt="google"
                  />
                </div>
              </OriginButton>
            </motion.div>

            <motion.div variants={itemVars}>
              <OriginButton
                onClick={() => handleLogin("github")}
                bgColor="#161b22"
                hoverColor="#21262d"
                darkColor="#818282"
                darkHoverColor="#818282"
                iconColor="#fff"
                iconHoverColor="#fff"
                darkIconColor="#000"
                darkIconHoverColor="#000"
                className="w-full !p-3"
              >
                <div className="flex items-center justify-center">
                  <Image
                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                    width={18}
                    height={18}
                    className="invert"
                    alt="github"
                  />
                </div>
              </OriginButton>
            </motion.div>
          </div>
        </div>

        <motion.p
          variants={itemVars}
          className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
        >
          &copy; 2026 K-Space CMS
        </motion.p>
      </motion.div>
    </div>
  );
}
