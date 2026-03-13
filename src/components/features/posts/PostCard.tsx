import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate, getCommentCount, getPostExcerpt } from "@/lib/postUtils";

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const commentCount = getCommentCount(post);
  const [imageSrc, setImageSrc] = useState(post.image_url ?? "/no-image.svg");

  useEffect(() => {
    setImageSrc(post.image_url ?? "/no-image.svg");
  }, [post.image_url]);

  return (
    <article className="post-card h-full">
      <Link href={`/posts/${post.id}`} className="group flex h-full flex-col gap-4">
        <div className="post-card-img group rounded-2xl overflow-hidden">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300 "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            onError={() => setImageSrc("/no-image.svg")}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={`${post.id}-${tag}`}
                  className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 text-2xl font-bold">
            {post.title}
          </h3>

          <p className="theme-muted text-xs">
            <span className="font-semibold text-current">
              {post.profiles?.username ?? "member"}
            </span>
            {" on "}
            {formatDate(post.created_at)}
            {commentCount > 0 &&
              ` | ${commentCount} comment${commentCount === 1 ? "" : "s"}`}
          </p>

          <p className="theme-muted line-clamp-2 text-sm leading-6">
            {getPostExcerpt(post, 160)}
          </p>
        </div>
      </Link>
    </article>
  );
}
