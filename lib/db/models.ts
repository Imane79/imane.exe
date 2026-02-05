import { ObjectId } from "mongodb";

// Post model
export interface Post {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  readingTime?: number; // in minutes
}

// Admin model
export interface Admin {
  _id?: ObjectId;
  username: string;
  password: string; // hashed with bcrypt
  createdAt: Date;
}

// Helper types for creating/updating
export type CreatePostInput = Omit<Post, "_id" | "createdAt" | "updatedAt">;
export type UpdatePostInput = Partial<CreatePostInput>;
