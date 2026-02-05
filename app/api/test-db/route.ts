import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/mongodb";

export async function GET() {
  try {
    const db = await getDb();

    // Try to list collections
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: "Database connected!",
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Database connection failed" },
      { status: 500 },
    );
  }
}
