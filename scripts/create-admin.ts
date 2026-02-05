import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { getDb } from "../lib/db/mongodb";
import { hashPassword } from "../lib/auth/password";
import { Admin } from "../lib/db/models";

async function createAdmin() {
  try {
    console.log("🔄 Connecting to database...");
    const db = await getDb();

    // Check if admin already exists
    const existingAdmin = await db
      .collection<Admin>("admins")
      .findOne({ username: "admin" });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      process.exit(1);
    }

    // Hash the password
    console.log("🔐 Hashing password...");
    const hashedPassword = await hashPassword("1234"); // CHANGE THIS!

    // Create admin user
    console.log("👤 Creating admin user...");
    const result = await db.collection<Admin>("admins").insertOne({
      username: "admin",
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log("✅ Admin user created successfully!");
    console.log("📝 Username: admin");
    console.log("🔑 Password: 1234"); // CHANGE THIS!
    console.log(`🆔 User ID: ${result.insertedId}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
