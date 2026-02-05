import Link from "next/link";
import { getDb } from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";

export default async function AdminDashboard() {
  // Fetch all posts (we'll add them later, but this prepares the structure)
  const db = await getDb();
  const posts = await db
    .collection<Post>("posts")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">Dashboard</h2>
        <p className="text-zinc-400">Manage your blog posts and content</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="text-zinc-400 text-sm mb-1">Total Posts</div>
          <div className="text-3xl font-bold text-teal-400">{posts.length}</div>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="text-zinc-400 text-sm mb-1">Published</div>
          <div className="text-3xl font-bold text-soft-blue">
            {posts.filter((p) => p.published).length}
          </div>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6">
          <div className="text-zinc-400 text-sm mb-1">Drafts</div>
          <div className="text-3xl font-bold text-zinc-400">
            {posts.filter((p) => !p.published).length}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/admin/posts/new"
          className="px-6 py-3 bg-teal-400 text-zinc-900 font-semibold rounded
                   hover:bg-teal-400-dark transition-colors inline-block"
        >
          [CREATE NEW POST]
        </Link>
        <Link
          href="/admin/posts"
          className="px-6 py-3 bg-zinc-700 text-zinc-300 font-semibold rounded
                   hover:bg-zinc-600 transition-colors inline-block"
        >
          [MANAGE POSTS]
        </Link>
      </div>

      {/* Recent Posts Preview */}
      <div>
        <h3 className="text-xl font-semibold text-zinc-100 mb-4">
          Recent Posts
        </h3>
        {posts.length === 0 ? (
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 text-center">
            <p className="text-zinc-400 mb-4">No posts yet</p>
            <p className="text-sm text-zinc-500">
              Create your first post to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.slice(0, 5).map((post) => (
              <div
                key={post._id?.toString()}
                className="bg-zinc-800 border border-zinc-700 rounded-lg p-4
                         hover:border-teal-400 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-zinc-100 mb-1">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <span>
                        {post.published ? "✅ Published" : "📝 Draft"}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
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
                    href={`/admin/posts/${post.slug}`}
                    className="px-4 py-2 bg-zinc-700 text-zinc-300 rounded text-sm
                             hover:bg-zinc-600 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
