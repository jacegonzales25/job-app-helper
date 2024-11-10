"use server";

import { userSchema } from "./signup-form";
import * as bcrypt from "bcrypt";
import * as db from "@/server/db";
import * as schema from "@/server/db/schema";
import { createSession } from "@/lib/session";
import { insertSession } from "@/server/db"; // Ensure insertSession is properly imported

type InsertUser = typeof schema.users.$inferInsert;
type InsertSession = typeof schema.sessions.$inferInsert;

export async function signUp(values: typeof userSchema) {
  // 1. Validate Fields
  const validationResult = userSchema.safeParse(values);
  if (!validationResult.success) {
    return {
      status: 400,
      error: validationResult.error.issues,
    };
  }

  const { email, password } = validationResult.data;

  // 2. Check if the user already exists
  try {
    const existingUser = await db.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return { status: 400, error: "User already exists" };
    }
  } catch (error) {
    console.error("Error checking for existing user:", error);
    return { status: 500, error: "Internal server error" };
  }

  // 3. Hash password and create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: InsertUser = {
    email,
    passwordHash: hashedPassword,
    createdAt: new Date(),
    oauthProvider: null,
    oauthId: null,
  };

  let insertedUser;
  try {
    // Insert the user in the database
    insertedUser = await db.insertUser(user);
  } catch (error) {
    console.error("Error inserting user:", error);
    return { status: 500, error: "Failed to create user" };
  }

  // 4. Create session for the new user and store it in the database
  try {
    const sessionToken = await createSession(insertedUser.id);
    const sessionData: InsertSession = {
      userId: insertedUser.id,
      sessionToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1-day expiration
      createdAt: new Date(),
    };

    // Insert the session into the database
    await insertSession(sessionData);
  } catch (error) {
    console.error("Error creating session:", error);
    return { status: 500, error: "Failed to create session" };
  }

  return { status: 200, message: "User signed up successfully" };
}
