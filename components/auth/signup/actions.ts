"use server";

import { userSchema } from "./signup-form";
import * as bcrypt from "bcrypt";
import * as db from "@/server/db";
import * as schema from "@/server/db/schema";
import { createSession } from "@/lib/session";

type InsertUser = typeof schema.users.$inferInsert;

export async function signUp(values: typeof userSchema) {
  // 1. Validate Fields

  const validationResult = userSchema.safeParse(values);
  if (!validationResult.success) {
    // 400 Bad Request
    return {
      status: 400,
      error: validationResult.error.issues,
    };
  }

  // 2. Create User (send confirmation email if scaling)
  const existingUser = await db.db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (existingUser) {
    return { status: 400, error: "User already exists" };
  }
  const { email, password } = validationResult.data;
  try {
    const existingUser = await db.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return {
        status: 400,
        error: "User already exists",
      };
    }
  } catch (error) {
    console.error("Error checking for existing user:", error);
    return {
      status: 500,
      error: "Internal server error",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Prepare the User Object
  const user: InsertUser = {
    email,
    passwordHash: hashedPassword,
    createdAt: new Date(),
    oauthProvider: null, // Since this is a sign-up with email/password
    oauthId: null,
    // Add any other fields as per your schema, setting defaults if necessary
  };

  try {
    const insertedUser = await db.insertUser(user);

    // 5. Create session using the inserted user's id
    await createSession(insertedUser.id);
  } catch (error) {
    console.error("Error inserting user:", error);
    return {
      status: 500,
      error: "Failed to create user",
    };
  }
}
