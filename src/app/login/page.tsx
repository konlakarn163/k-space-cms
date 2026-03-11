"use client";

import { supabase } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import OriginButton from "@/components/ui/OriginButton";

export default function LoginPage() {
  const handleLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white dark:bg-gray-950 overflow-hidden font-sans">
      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md p-8 mx-4"
      >
        <div className="text-center mb-10">
          <motion.div
            variants={itemVars}
            className="inline-block mb-4 p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-xl shadow-lg" />
          </motion.div>
          <motion.h1
            variants={itemVars}
            className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            Konlakarn <span className="text-emerald-500">.</span>
          </motion.h1>
          <motion.p
            variants={itemVars}
            className="mt-2 text-slate-500 dark:text-slate-400 font-medium"
          >
            Welcome to the community
          </motion.p>
        </div>

        <div className="flex flex-col gap-4">
          <motion.div variants={itemVars}>
            <OriginButton
              onClick={() => handleLogin("google")}
              baseColor="#ffffff"
              darkColor="#f8fafc"
              hoverColor="#f1f5f9"
              iconColor="#161b22"
              iconHoverColor="#161b22"
              darkHoverColor="#1e293b"
              className="w-full border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5 mr-3"
                  alt="google"
                />
                <span className="text-slate-900">Continue with Google</span>
              </div>
            </OriginButton>
          </motion.div>

          <motion.div variants={itemVars}>
            <OriginButton
              onClick={() => handleLogin("github")}
              baseColor="#161b22"
              darkColor="#0d1117"
              hoverColor="#24292f"
              darkHoverColor="#30363d"
              className="w-full text-white shadow-lg"
            >
              <div className="flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  className="w-5 h-5 mr-3 invert"
                  alt="github"
                />
                <span className="text-white group-hover:text-white">
                  Continue with GitHub
                </span>
              </div>
            </OriginButton>
          </motion.div>
        </div>

        <motion.p
          variants={itemVars}
          className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest"
        >
          &copy; 2026 Konlakarn Community
        </motion.p>
      </motion.div>
    </div>
  );
}
