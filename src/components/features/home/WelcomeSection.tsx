"use client";

import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { FaBitcoin, FaBriefcase, FaNewspaper, FaPalette, FaRobot, FaRocket, FaServer } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { RiNextjsFill } from "react-icons/ri";
import { SiSupabase } from "react-icons/si";
import { TbCpu, TbTrendingUp } from "react-icons/tb";
import type { IconType } from "react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type WelcomeSectionProps = {
  loading?: boolean;
  tags: string[];
  loadingTags?: boolean;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
};

const TAG_ICONS: Record<string, IconType> = {
  ai: FaRobot,
  business: FaBriefcase,
  crypto: FaBitcoin,
  digital: HiSparkles,
  news: FaNewspaper,
  startups: FaRocket,
  technology: TbCpu,
  trends: TbTrendingUp,
  nextjs: RiNextjsFill,
  supabase: SiSupabase,
  backend: FaServer,
  design: FaPalette,
};

function getIcon(tag: string) {
  return TAG_ICONS[tag.toLowerCase()] ?? HiSparkles;
}

export default function WelcomeSection({
  tags,
  loadingTags = false,
  selectedTag,
  onSelectTag,
}: WelcomeSectionProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = useMemo(
    () => (selectedTag ? selectedTag.toUpperCase() : "ALL"),
    [selectedTag],
  );

  const handleSelectTag = (tag: string) => {
    onSelectTag(tag);
    setOpen(false);
  };

  return (
    <section className="relative flex flex-col items-center px-4 py-12 text-center md:py-20">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[100px] dark:bg-emerald-500/10" />
      </div>

      <div className="max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-white">
          <span className="bg-linear-to-r from-[#ef5a3c] via-orange-500 to-[#ef5a3c] bg-clip-text text-transparent">
            K-Space CMS:
          </span>
          <br />
          <span className="leading-[1.1]">
            Community for Builders, Thinkers and Creators.
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300">
          A community-driven CMS on{" "}
          <span className="text-slate-900 dark:text-slate-200 font-medium">
            Next.js, Supabase and Express.
          </span>
          <br className="hidden md:block" /> Share engineering notes, product
          updates and collaborative stories.
        </p>
      </div>

      <div className="my-12 h-px w-full max-w-4xl bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800" />

      {loadingTags ? (
        <div className="flex flex-wrap justify-center gap-3 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="flex w-full justify-end lg:hidden">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
                >
                  <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
                  <span>Filter: {selectedLabel}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                className="w-[min(92vw,24rem)] rounded-3xl p-3"
              >
                <div className="mb-2 px-2 text-left">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Filter tags
                  </p>
                </div>
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectTag("")}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                      selectedTag === ""
                        ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <HiSparkles
                        className={
                          selectedTag === "" ? "text-inherit" : "text-emerald-500"
                        }
                        aria-hidden="true"
                      />
                      <span>All</span>
                    </span>
                  </button>
                  {tags.map((tag) => {
                    const active = selectedTag === tag;
                    const TagIcon = getIcon(tag);

                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleSelectTag(active ? "" : tag)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                          active
                            ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <TagIcon
                            className={active ? "text-inherit" : "text-emerald-500"}
                            aria-hidden="true"
                          />
                          <span>{tag.toUpperCase()}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="hidden flex-wrap justify-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => onSelectTag("")}
              className={`group flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                selectedTag === ""
                  ? "bg-gray-900 text-white shadow-lg dark:bg-emerald-500 dark:text-slate-950"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400 dark:bg-background dark:border-gray-600 dark:text-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <HiSparkles
                className={
                  selectedTag === "" ? "text-inherit" : "text-emerald-500"
                }
                aria-hidden="true"
              />
              All
            </button>
            {tags.map((tag) => {
              const active = selectedTag === tag;
              const TagIcon = getIcon(tag);

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag(active ? "" : tag)}
                  className={`group flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 ${
                    active
                      ? "bg-gray-900 text-white shadow-lg dark:bg-emerald-500 dark:text-slate-950"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-400 dark:bg-background dark:border-gray-600 dark:text-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <TagIcon
                    className={active ? "text-inherit" : "text-emerald-500"}
                    aria-hidden="true"
                  />
                  {tag.toUpperCase()}
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
