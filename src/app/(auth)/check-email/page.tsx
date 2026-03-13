"use client";

import { Input } from "@/components/ui/input";
import OriginButton from "@/components/ui/OriginButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { supabase } from "@/utils/supabase/client";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function CheckEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromQuery = new URLSearchParams(window.location.search).get("email") ?? "";
    setEmail(fromQuery);
  }, []);

  const getAuthCallbackUrl = () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");

    return `${baseUrl.replace(/\/$/, "")}/auth/callback`;
  };

  const handleResend = async () => {
    try {
      setLoading(true);

      if (!email.trim()) {
        throw new Error("กรุณากรอกอีเมลก่อนส่งอีกครั้ง");
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: getAuthCallbackUrl(),
        },
      });

      if (error) throw error;
      toast.success("ส่งอีเมลยืนยันใหม่แล้ว กรุณาเช็คกล่องจดหมายอีกครั้ง");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ไม่สามารถส่งอีเมลยืนยันใหม่ได้",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 font-sans transition-colors duration-500 dark:bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/5" />
      </div>

      <div className="absolute right-6 top-6 z-30">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-4 w-full max-w-md rounded-[2.5rem] border border-white/40 bg-white/70 p-8 shadow-2xl transition-colors dark:border-slate-800/50 dark:bg-neutral-900/60">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <MailCheck size={28} />
          </div>
        </div>

        <h1 className="text-center text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Check your email
        </h1>
        <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
          เราส่งลิงก์ยืนยันบัญชีไปที่อีเมลของคุณแล้ว กรุณาเปิดอีเมลและกดยืนยันก่อนเข้าสู่ระบบ
        </p>

        <div className="mt-6 space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="h-13 w-full rounded-2xl border-slate-200 bg-white/50 px-5 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/50"
          />

          <button
            onClick={handleResend}
            disabled={loading || !email.trim()}
            className="w-full rounded-2xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {loading ? "Sending..." : "Resend verification email"}
          </button>

          <Link href="/login" className="block">
            <OriginButton className="w-full">
              Back to login
            </OriginButton>
          </Link>
        </div>

      </div>
    </div>
  );
}
