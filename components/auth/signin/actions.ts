"use server";

import * as bcrypt from "bcrypt";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { createSession } from "@/lib/session";
import { insertSession } from "@/server/db";
import { NextResponse } from "next/server";

type InsertSession = typeof schema.sessions.$inferInsert;

export async function signIn(
  email: string,
  password: string,
  response?: NextResponse
) {
  // 1. Find the user by email
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!user) {
    return { status: 400, error: "Invalid email or password" };
  }

  // 2. Verify the password
  const passwordMatch = await bcrypt.compare(password, user.passwordHash || "");
  if (!passwordMatch) {
    return { status: 400, error: "Invalid email or password" };
  }

  // 3. Create a session for the user
  try {
    const sessionToken = await createSession(user.id, response);
    const sessionData: InsertSession = {
      userId: user.id,
      sessionToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1-day expiration
      createdAt: new Date(),
    };

    // Insert the session into the database
    await insertSession(sessionData);

    return { status: 200, message: "Login successful" };
  } catch (error) {
    console.error("Error creating session:", error);
    return { status: 500, error: "Failed to create session" };
  }
}
