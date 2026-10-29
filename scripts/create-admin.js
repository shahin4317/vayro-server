
import "dotenv/config";

import { createAuth } from "../lib/auth.js";
import { client, db, connectDB } from "../config/db.js";

const createFirstAdmin = async () => {
  try {
    const name = process.env.FIRST_ADMIN_NAME;
    const email = process.env.FIRST_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.FIRST_ADMIN_PASSWORD;

    if (!name || !email || !password || password.length < 12) {
      throw new Error("Provide admin name, email and a password of at least 12 characters.");
    }

    await connectDB();

    // Only allow initial admin creation
    const adminExists = await db
      .collection("user")
      .findOne({ role: "admin" });

    if (adminExists) {
      throw new Error("An admin account already exists.");
    }

    const userExists = await db
      .collection("user")
      .findOne({ email });

    if (userExists) {
      throw new Error("This email is already registered.");
    }

    // Enable signup only for this script instance
    const setupAuth = createAuth({
      allowSignUp: true,
    });

    const result = await setupAuth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!result?.user?.id) {
      throw new Error("Admin account creation failed.");
    }

    // Give the newly created user the admin role
    const updated = await db.collection("user").updateOne(
      { email: result.user.email },
      { $set: { role: "admin" } }
    );

    if (updated.matchedCount !== 1) {
      throw new Error("Failed to assign admin role.");
    }

    console.log("First Admin Created Successfully!");
  } catch (error) {
    console.error("Setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

createFirstAdmin();
