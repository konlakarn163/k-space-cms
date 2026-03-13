"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import Image from "next/image";
import {
  ArrowLeft,
  Eye,
  ImagePlus,
  X,
  ScreenShare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/features/RichTextEditor";
import PostPreviewPanel from "@/components/features/write/PostPreviewPanel";
import type { Post } from "@/lib/types";
import { createPost, updatePost } from "@/services/postService";
import { uploadImage } from "@/services/storageService";
import { fetchTags, type MasterTag } from "@/services/tagService";
import { supabase } from "@/utils/supabase/client";
import { postFormSchema } from "@/lib/validators/postForm";
import { toast } from "react-toastify";

type FormErrors = Partial<Record<"title" | "content" | "tags" | "imageFile", string>>;

type WritePostContentProps = {
  user: User;
  mode?: "create" | "edit";
  initialPost?: Post;
};

export default function WritePostContent({
  user,
  mode = "create",
  initialPost,
}: WritePostContentProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialPost?.tags ?? [],
  );
  const [masterTags, setMasterTags] = useState<MasterTag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(
    initialPost?.image_url ?? null,
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    void initSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialPost) return;
    setTitle(initialPost.title);
    setContent(initialPost.content);
    setSelectedTags(initialPost.tags ?? []);
    setCoverPreviewUrl(initialPost.image_url ?? null);
  }, [initialPost]);

  useEffect(() => {
    const loadTags = async () => {
      setLoadingTags(true);
      try {
        const result = await fetchTags({ session });
        setMasterTags(result);
      } finally {
        setLoadingTags(false);
      }
    };

    void loadTags();
  }, [session]);

  const previewTags = useMemo(() => selectedTags, [selectedTags]);

  const toggleTag = (tag: string) => {
    setFormErrors((prev) => ({ ...prev, tags: undefined }));
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((item) => item !== tag);
      }
      return [...prev, tag];
    });
  };

  const handleInlineImageUpload = async (file: File) => {
    if (!session) {
      throw new Error("Unauthorized: กรุณาเข้าสู่ระบบใหม่ก่อนอัปโหลดรูป");
    }

    return uploadImage({ session, file, folder: "inline" });
  };

  const handlePublish = async () => {
    if (!session) return;

    const validated = postFormSchema.safeParse({
      title,
      content,
      tags: selectedTags,
      imageFile,
    });

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      setFormErrors({
        title: fieldErrors.title?.[0],
        content: fieldErrors.content?.[0],
        tags: fieldErrors.tags?.[0],
        imageFile: fieldErrors.imageFile?.[0],
      });
      toast.error(
        fieldErrors.title?.[0]
          ?? fieldErrors.content?.[0]
          ?? fieldErrors.tags?.[0]
          ?? fieldErrors.imageFile?.[0]
          ?? "ข้อมูลโพสต์ไม่ถูกต้อง",
      );
      return;
    }

    setIsPublishing(true);
    setErrorMessage(null);
    setFormErrors({});

    try {
      const imageUrl = imageFile
        ? await uploadImage({ session, file: imageFile, folder: "covers" })
        : (initialPost?.image_url ?? null);

      if (mode === "edit" && initialPost) {
        await updatePost({
          session,
          postId: initialPost.id,
          title: title.trim(),
          content,
          imageUrl,
          tags: selectedTags,
        });

        toast.success("อัปเดตโพสต์สำเร็จ");
        router.push(`/posts/${initialPost.id}`);
        router.refresh();
        return;
      }

      const createdPost = await createPost({
        session,
        title: title.trim(),
        content,
        imageUrl,
        tags: selectedTags,
      });

      toast.success("สร้างโพสต์สำเร็จ");
      router.push(`/posts/${createdPost.id}`);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Cannot publish post";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  };

  const heading =
    mode === "edit"
      ? "Edit article with live preview."
      : "Compose with live preview.";
  const subtitle =
    mode === "edit"
      ? "Update content, tags and cover image, then save changes."
      : "Draft your editorial piece, upload a cover image, insert inline media and preview the final result before publishing.";

  return (
    <div className="theme-canvas min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                mode === "edit" && initialPost
                  ? `/posts/${initialPost.id}`
                  : "/",
              )
            }
            className="theme-secondary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview((prev) => !prev)}
              className="theme-secondary-button inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm lg:hidden"
            >
              <Eye className="h-4 w-4" />{" "}
              {showPreview ? "Hide preview" : "Show preview"}
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing || !title.trim() || !content.trim()}
              className="btn-main group relative overflow-hidden bg-amber-600 text-white"
            >
              <ScreenShare className="h-4 w-4 transition-transform group-hover:-rotate-12" />
              {isPublishing
                ? mode === "edit"
                  ? "Saving..."
                  : "Publishing..."
                : mode === "edit"
                  ? "Save changes"
                  : "Publish article"}
            </button>
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="theme-card rounded-4xl border p-5 sm:p-6 lg:p-8">
            <p className="theme-muted text-xs uppercase tracking-[0.24em]">
              {mode === "edit" ? "Edit article" : "Write a new article"}
            </p>
            <h1 className="font-serif mt-3 text-4xl font-bold sm:text-5xl">
              {heading}
            </h1>
            <p className="theme-muted mt-4 max-w-2xl text-sm leading-7">
              {subtitle}
            </p>

            <div className="mt-8 space-y-5">
              <Input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setFormErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Article title"
                className="h-auto w-full rounded-[1.25rem] px-5 py-4 text-lg font-semibold"
              />
              {formErrors.title ? (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              ) : null}

              <div className="space-y-3">
                <div>
                  <p className="theme-muted text-xs uppercase tracking-[0.2em]">
                    Tags
                  </p>
                </div>

                {loadingTags ? (
                  <div className="flex flex-wrap gap-2 animate-pulse">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-7 w-20 rounded theme-elevated"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {masterTags.length > 0 ? (
                      masterTags.map((tag) => {
                        const active = selectedTags.includes(tag.name);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.name)}
                            className={`tag-chip ${active ? "opacity-100 ring-1 ring-(--accent)" : "opacity-70"}`}
                          >
                            {tag.name}
                          </button>
                        );
                      })
                    ) : (
                      <p className="theme-muted text-sm">
                        No master tags yet. Create posts with tags first.
                      </p>
                    )}
                  </div>
                )}
                {formErrors.tags ? (
                  <p className="text-sm text-red-500">{formErrors.tags}</p>
                ) : null}
              </div>

              <div className="space-y-3">
                <label className="theme-secondary-button flex cursor-pointer items-center justify-center gap-2 rounded-[1.25rem] px-5 py-4 text-sm">
                  <ImagePlus className="h-4 w-4" />
                  <span>
                    {imageFile
                      ? imageFile.name
                      : coverPreviewUrl
                        ? "Replace cover image"
                        : "Choose cover image"}
                  </span>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setImageFile(file);
                      setFormErrors((prev) => ({ ...prev, imageFile: undefined }));
                      setCoverPreviewUrl(
                        file
                          ? URL.createObjectURL(file)
                          : (initialPost?.image_url ?? null),
                      );
                    }}
                  />
                </label>
                {formErrors.imageFile ? (
                  <p className="text-sm text-red-500">{formErrors.imageFile}</p>
                ) : null}

                {coverPreviewUrl ? (
                  <div className="relative aspect-video overflow-hidden rounded-[1.25rem]">
                    <Image
                      src={coverPreviewUrl}
                      alt="cover preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 100vw, 50vw"
                      unoptimized
                      onError={() => setCoverPreviewUrl('/no-image.svg')}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setCoverPreviewUrl(initialPost?.image_url ?? null);
                      }}
                      className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>

              <RichTextEditor
                value={content}
                onChange={(value) => {
                  setContent(value);
                  setFormErrors((prev) => ({ ...prev, content: undefined }));
                }}
                placeholder="Write your article here..."
                onImageUpload={handleInlineImageUpload}
              />
              {formErrors.content ? (
                <p className="text-sm text-red-500">{formErrors.content}</p>
              ) : null}

              {errorMessage ? (
                <p className="text-sm text-red-500">{errorMessage}</p>
              ) : null}
            </div>
          </div>

          <div className={showPreview ? "block" : "hidden xl:block"}>
            <PostPreviewPanel
              title={title}
              content={content}
              coverPreviewUrl={coverPreviewUrl}
              tags={previewTags}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
