import Link from "next/link";
import { getDb } from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPostsPage() {
  const db = await getDb();
  const posts = await db
    .collection<Post>("posts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-100 mb-2">
            Manage Posts
          </h2>
          <p className="text-zinc-400">Edit, publish, or update your posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-6 py-3 bg-teal-400 text-zinc-900 font-semibold rounded
                   hover:bg-teal-500 transition-colors inline-block"
        >
          [CREATE NEW POST]
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 text-center">
          <p className="text-zinc-400 mb-4">No posts yet</p>
          <p className="text-sm text-zinc-500">
            Create your first post to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id?.toString()}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-4
                       hover:border-teal-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                    {post.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                    <span>{post.published ? "✅ Published" : "📝 Draft"}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="font-mono text-xs text-zinc-500">
                      /blog/{post.slug}
                    </span>
                    {post.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-soft-blue">
                          {post.tags.join(", ")}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Link
                  href={`/admin/posts/${encodeURIComponent(post.slug)}`}
                  className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded text-sm
                           hover:bg-zinc-600 transition-colors whitespace-nowrap"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
