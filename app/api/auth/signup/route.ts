// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { userSchema } from "@/components/auth/signup/signup-form";
import * as bcrypt from "bcrypt";
import { db, insertUser } from "@/server/db";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = userSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = {
      email,
      passwordHash: hashedPassword,
      createdAt: new Date(),
      oauthProvider: null,
      oauthId: null,
    };

    // Insert user into database
    const insertedUser = await insertUser(user);

    // Create session
    const response = NextResponse.redirect("/dashboard"); // Redirect to dashboard
    await createSession(insertedUser.id, response);

    return response;
  } catch (error) {
    console.error("Error during sign-up:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
