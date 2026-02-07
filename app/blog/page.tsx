import Link from "next/link";
import { getDb } from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const db = await getDb();
  const posts = await db
    .collection<Post>("posts")
    .find({ published: true })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dreamy Background */}
      <div className="fixed inset-0 -z-10">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-blue-300 to-blue-400"></div>

        {/* Cloud layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-200/20 via-transparent to-purple-200/20"></div>

        {/* Floating clouds (CSS animation) */}
        <div className="absolute top-20 left-10 w-64 h-32 bg-white/40 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-40 bg-white/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-96 h-48 bg-white/25 rounded-full blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-36 bg-pink-100/20 rounded-full blur-2xl animate-float"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 min-h-screen flex items-center justify-center">
        {/* Desktop Window */}
        <div className="w-full max-w-4xl">
          {/* Window Container */}
          <div className="bg-zinc-200 border-2 border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 shadow-2xl">
            {/* Title Bar */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-2 py-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">📁</span>
                <span className="text-white font-bold text-sm">
                  IMANE.EXE - My Documents
                </span>
              </div>
              <div className="flex gap-1">
                <button className="w-5 h-5 bg-zinc-300 border border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 flex items-center justify-center text-xs hover:bg-zinc-400">
                  _
                </button>
                <button className="w-5 h-5 bg-zinc-300 border border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 flex items-center justify-center text-xs hover:bg-zinc-400">
                  □
                </button>
                <button className="w-5 h-5 bg-zinc-300 border border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 flex items-center justify-center text-xs hover:bg-red-500">
                  ✕
                </button>
              </div>
            </div>

            {/* Menu Bar */}
            <div className="bg-zinc-200 border-b border-zinc-400 px-2 py-1 flex gap-4 text-sm">
              <span className="hover:bg-blue-600 hover:text-white px-2 cursor-pointer">
                File
              </span>
              <span className="hover:bg-blue-600 hover:text-white px-2 cursor-pointer">
                Edit
              </span>
              <span className="hover:bg-blue-600 hover:text-white px-2 cursor-pointer">
                View
              </span>
            </div>

            {/* Toolbar */}
            <div className="bg-zinc-200 border-b border-zinc-400 px-2 py-2 flex gap-2">
              <div className="px-3 py-1 bg-zinc-300 border border-t-white border-l-white border-r-zinc-800 border-b-zinc-800 text-xs font-mono">
                📂 Blog Posts
              </div>
            </div>

            {/* File List Area */}
            <div className="bg-white p-4 min-h-[500px] max-h-[600px] overflow-y-auto">
              {/* Header */}
              <div className="mb-6 pb-4 border-b-2 border-zinc-300">
                <h1 className="text-2xl font-pixel text-blue-800 mb-2">
                  IMANE.EXE
                </h1>
                <p className="text-sm text-zinc-600 font-mono">
                  &gt; Personal development log — Select a file to read
                </p>
              </div>

              {/* File List */}
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-zinc-500 font-mono text-sm">
                    This folder is empty.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {posts.map((post, index) => (
                    <Link
                      key={post._id?.toString()}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <div className="flex items-center gap-3 p-2 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                        {/* File Icon */}
                        <span className="text-2xl">📄</span>

                        {/* File Info */}
                        <div className="flex-1">
                          <div className="font-bold text-sm group-hover:text-white">
                            {post.title}
                          </div>
                          <div className="flex gap-4 text-xs text-zinc-600 group-hover:text-blue-100 font-mono">
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span>{post.readingTime || 1} min</span>
                            {post.tags && post.tags.length > 0 && (
                              <span className="flex gap-1">
                                {post.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-1 bg-zinc-200 group-hover:bg-blue-500 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* File Size */}
                        <div className="text-xs text-zinc-500 group-hover:text-blue-100 font-mono">
                          {index + 1} KB
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Status Bar */}
            <div className="bg-zinc-200 border-t border-zinc-400 px-2 py-1 flex justify-between text-xs">
              <span className="font-mono">{posts.length} object(s)</span>
              <span className="font-mono">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
