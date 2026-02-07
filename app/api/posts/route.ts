import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/mongodb";
import { Post } from "@/lib/db/models";
import { getSession } from "@/lib/auth/session";

// Helper: Calculate reading time
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return minutes;
}

// GET /api/posts - List all posts (for admin)
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const posts = await db
      .collection<Post>("posts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("List posts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, tags, published } = body;

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 },
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug must contain only lowercase letters, numbers, and dashes",
        },
        { status: 400 },
      );
    }

    const db = await getDb();

    // Check if slug already exists
    const existingPost = await db.collection<Post>("posts").findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 },
      );
    }

    // Calculate reading time
    const readingTime = calculateReadingTime(content);

    // Create post
    const newPost: Omit<Post, "_id"> = {
      title,
      slug,
      content,
      excerpt: excerpt || undefined,
      tags: Array.isArray(tags) ? tags : [],
      published: Boolean(published),
      readingTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection<Post>("posts")
      .insertOne(newPost as Post);

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      postId: result.insertedId.toString(),
      slug,
    });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
