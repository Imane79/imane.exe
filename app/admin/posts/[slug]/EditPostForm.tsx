"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type EditPostInitial = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  published: boolean;
};

type EditPostFormProps = {
  initial: EditPostInitial;
  currentSlug: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditPostForm({
  initial,
  currentSlug,
}: EditPostFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [content, setContent] = useState(initial.content);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [tags, setTags] = useState(initial.tags.join(", "));
  const [published, setPublished] = useState(initial.published);
  const [slugEdited, setSlugEdited] = useState(
    initial.slug !== slugify(initial.title),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slugEdited) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/posts/${encodeURIComponent(currentSlug)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            content,
            excerpt: excerpt || undefined,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
            published,
          }),
        },
      );

      const data = (await response.json()) as { error?: string };

      if (response.ok) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        setError(data.error || "Failed to update post");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="text-teal-400 hover:text-teal-500 transition-colors text-sm mb-4 inline-block"
        >
          ← Back to Posts
        </Link>
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">[EDIT POST]</h1>
        <p className="text-zinc-400">Update your blog post</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded mb-6">
          <span className="font-mono">❌ ERROR:</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              TITLE *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={handleTitleChange}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded
                       text-zinc-100 placeholder-zinc-500
                       focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="My Awesome Blog Post"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              SLUG *{" "}
              <span className="text-zinc-500 font-normal">
                (URL-friendly version)
              </span>
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(e.target.value);
              }}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded
                       text-zinc-100 placeholder-zinc-500 font-mono text-sm
                       focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="my-awesome-blog-post"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Will be: /blog/{slug || "your-slug-here"}
            </p>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              CONTENT *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isLoading}
              rows={15}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded
                       text-zinc-100 placeholder-zinc-500
                       focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       font-mono text-sm resize-y"
              placeholder="Write your post content here..."
            />
            <p className="text-xs text-zinc-500 mt-1">
              Supports plain text and markdown
            </p>
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              EXCERPT{" "}
              <span className="text-zinc-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded
                       text-zinc-100 placeholder-zinc-500
                       focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Short summary for blog list..."
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-zinc-300 mb-2"
            >
              TAGS{" "}
              <span className="text-zinc-500 font-normal">
                (comma-separated)
              </span>
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded
                       text-zinc-100 placeholder-zinc-500
                       focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="react, typescript, tutorial"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              disabled={isLoading}
              className="w-5 h-5 bg-zinc-900 border-zinc-600 rounded
                       focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-zinc-800
                       disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label
              htmlFor="published"
              className="text-sm font-medium text-zinc-300"
            >
              {published
                ? "✅ PUBLISHED (visible to public)"
                : "📝 DRAFT (not visible)"}
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-teal-400 text-zinc-900
                       hover:bg-teal-500 font-semibold rounded
                       transition-colors"
          >
            {isLoading ? "SAVING..." : "[UPDATE POST]"}
          </button>
          <Link
            href="/admin/posts"
            className="px-6 py-3 bg-zinc-700 text-zinc-300 font-semibold rounded
                       hover:bg-zinc-600 transition-colors inline-block"
          >
            [CANCEL]
          </Link>
        </div>
      </form>
    </div>
  );
}
