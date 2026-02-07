import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const db = await getDb();

  const post = await db.collection<Post>("posts").findOne({
    slug: slug,
    published: true,
  });

  if (!post) {
    notFound();
  }

  const allPosts = await db
    .collection<Post>("posts")
    .find({ published: true })
    .sort({ createdAt: -1 })
    .toArray();

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dreamy Background */}
      <div className="fixed inset-0 -z-10">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-blue-300 to-blue-400"></div>

        {/* Cloud layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-200/20 via-transparent to-purple-200/20"></div>

        {/* Floating clouds */}
        <div className="absolute top-20 left-10 w-64 h-32 bg-white/40 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-40 bg-white/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-96 h-48 bg-white/25 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-36 bg-pink-100/20 rounded-full blur-2xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 min-h-screen flex items-center justify-center">
        {/* Document Window */}
        <div className="w-full max-w-4xl">
          {/* Window Container */}
          <div className="bg-zinc-200 border-2 border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 shadow-2xl">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-2 py-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">📄</span>
                <span className="text-white font-bold text-sm">
                  {post.title}.txt
                </span>
              </div>
              <div className="flex gap-1">
                <button className="w-5 h-5 bg-zinc-300 border border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 flex items-center justify-center text-xs hover:bg-zinc-400">
                  _
                </button>
                <button className="w-5 h-5 bg-zinc-300 border border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 flex items-center justify-center text-xs hover:bg-zinc-400">
                  □
                </button>
                <Link
                  href="/blog"
                  className="w-5 h-5 bg-zinc-300 border border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 flex items-center justify-center text-xs hover:bg-red-500"
                >
                  ✕
                </Link>
              </div>
            </div>

            {/* Menu Bar */}
            <div className="bg-zinc-200 border-b border-zinc-400 px-2 py-1 flex gap-4 text-sm">
              <Link
                href="/blog"
                className="hover:bg-blue-600 hover:text-white px-2"
              >
                ← Back
              </Link>
              <span className="hover:bg-blue-600 hover:text-white px-2 cursor-pointer">
                Edit
              </span>
              <span className="hover:bg-blue-600 hover:text-white px-2 cursor-pointer">
                View
              </span>
            </div>

            {/* Toolbar */}
            <div className="bg-zinc-200 border-b border-zinc-400 px-2 py-2 flex items-center gap-2">
              <div className="px-3 py-1 bg-zinc-300 border border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 text-xs font-mono">
                📄 {post.title}
              </div>
              <div className="flex-1"></div>
              <div className="text-xs text-zinc-600 font-mono">
                {post.readingTime || 1} min read
              </div>
            </div>

            {/* Document Content */}
            <div className="bg-white p-8 min-h-[600px] max-h-[70vh] overflow-y-auto">
              {/* Document Header */}
              <div className="border-b-2 border-zinc-300 pb-6 mb-6">
                <h1 className="text-3xl font-bold text-zinc-900 mb-3">
                  {post.title}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm text-zinc-600 font-mono">
                  <span>
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>
                    Modified: {new Date(post.updatedAt).toLocaleDateString()}
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-zinc max-w-none">
                <div className="text-zinc-800 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {post.content}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-12 pt-6 border-t-2 border-zinc-300 grid grid-cols-2 gap-4">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="p-3 bg-zinc-100 border-2 border-t-white border-l-white border-r-zinc-400 border-b-zinc-400 hover:bg-zinc-200"
                  >
                    <div className="text-xs text-zinc-600 mb-1">
                      ← Previous File
                    </div>
                    <div className="text-sm font-bold text-zinc-900 line-clamp-1">
                      {prevPost.title}
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}

                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="p-3 bg-zinc-100 border-2 border-t-white border-l-white border-r-zinc-400 border-b-zinc-400 hover:bg-zinc-200 text-right"
                  >
                    <div className="text-xs text-zinc-600 mb-1">
                      Next File →
                    </div>
                    <div className="text-sm font-bold text-zinc-900 line-clamp-1">
                      {nextPost.title}
                    </div>
                  </Link>
                ) : (
                  <div></div>
                )}
              </div>
            </div>

            {/* Status Bar */}
            <div className="bg-zinc-200 border-t border-zinc-400 px-2 py-1 flex justify-between text-xs">
              <span className="font-mono">
                {post.content.split(/\s+/).length} words
              </span>
              <span className="font-mono">Plain Text Document</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
