import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";
import { getSession } from "@/lib/auth/session";

// Helper: Calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug).trim();
    const normalizedSlug = slug.toLowerCase();
    const db = await getDb();
    let post = await db.collection<Post>("posts").findOne({ slug });
    if (!post && normalizedSlug !== slug) {
      post = await db
        .collection<Post>("posts")
        .findOne({ slug: normalizedSlug });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      post: {
        id: post._id?.toString(),
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt ?? "",
        tags: post.tags ?? [],
        published: post.published,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        readingTime: post.readingTime ?? 0,
      },
    });
  } catch (error) {
    console.error("Fetch post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug: rawSlug } = await params;
    const currentSlug = decodeURIComponent(rawSlug).trim().toLowerCase();
    const body = await request.json();
    const { title, slug, content, excerpt, tags, published } = body;
    const nextSlug = String(slug || "")
      .trim()
      .toLowerCase();

    if (!title || !nextSlug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9-]+$/.test(nextSlug)) {
      return NextResponse.json(
        {
          error:
            "Slug must contain only lowercase letters, numbers, and dashes",
        },
        { status: 400 },
      );
    }

    const db = await getDb();
    const existingPost = await db
      .collection<Post>("posts")
      .findOne({ slug: currentSlug });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (nextSlug !== currentSlug) {
      const slugConflict = await db
        .collection<Post>("posts")
        .findOne({ slug: nextSlug });
      if (slugConflict) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const readingTime = calculateReadingTime(content);
    const update: Partial<Post> = {
      title,
      slug: nextSlug,
      content,
      tags: Array.isArray(tags) ? tags : [],
      published: Boolean(published),
      readingTime,
      updatedAt: new Date(),
    };

    // Handle excerpt - add to update if it has content
    if (typeof excerpt === "string" && excerpt.trim().length > 0) {
      update.excerpt = excerpt.trim();
    }

    const updateOps: any = { $set: update };

    // If excerpt is empty but exists in the post, remove it
    if ((!excerpt || excerpt.trim().length === 0) && existingPost.excerpt) {
      updateOps.$unset = { excerpt: "" };
    }

    console.log("🔍 About to update post:");
    console.log("  Current slug:", currentSlug);
    console.log("  New slug:", nextSlug);

    await db
      .collection<Post>("posts")
      .updateOne({ _id: existingPost._id }, updateOps);

    console.log("✅ MongoDB update completed");

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      slug: nextSlug,
    });
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
