import { getDb } from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";
import EditPostForm from "./EditPostForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageParams = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export default async function EditPostPage({ params }: PageParams) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug;
  const slug = decodeURIComponent(rawSlug).trim();
  const normalizedSlug = slug.toLowerCase();

  const db = await getDb();
  let post = await db.collection<Post>("posts").findOne({ slug });
  if (!post && normalizedSlug !== slug) {
    post = await db.collection<Post>("posts").findOne({ slug: normalizedSlug });
  }

  if (!post) {
    const recent = await db
      .collection<Post>("posts")
      .find({})
      .project({ slug: 1, title: 1 })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded">
          <span className="font-mono">❌ ERROR:</span> Post not found
        </div>
        <div className="mt-4 bg-zinc-800 border border-zinc-700 rounded px-4 py-3 text-sm text-zinc-300">
          <div className="font-mono text-zinc-400 mb-2">Debug</div>
          <div>DB: {db.databaseName}</div>
          <div>Requested slug: {slug}</div>
          <div>Normalized slug: {normalizedSlug}</div>
          <div className="mt-2 text-zinc-400">Recent slugs:</div>
          <ul className="list-disc list-inside">
            {recent.map((item) => (
              <li key={item._id?.toString()}>
                {item.slug} — {item.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <EditPostForm
      initial={{
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt ?? "",
        tags: post.tags ?? [],
        published: post.published,
      }}
      currentSlug={post.slug}
    />
  );
}
