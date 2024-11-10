// app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { db, insertSession } from "@/server/db";
import {
  createSession,
  redirectToGoogleOAuth,
  handleGoogleOAuthCallback,
} from "@/lib/session";
import { userSchema } from "@/components/auth/signup/signup-form";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, provider, code } = body;

    // Handle OAuth login if `provider` is specified
    if (provider === "google") {
      // If the code is provided, it's the callback, otherwise it's the initial redirect
      if (code) {
        // OAuth callback - handle token exchange and user session
        return await handleOAuthCallback("google", code);
      } else {
        // Initial OAuth redirect - return Google OAuth URL
        const googleOAuthUrl = redirectToGoogleOAuth();
        return NextResponse.redirect(googleOAuthUrl);
      }
    }

    // Validate email/password input for standard sign-in
    const validationResult = userSchema.safeParse({ email, password });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash || ""
    );
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Create session for the user
    const response = NextResponse.redirect("/dashboard"); // Redirect to dashboard
    await createSession(user.id, response);

    return response;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// OAuth helper functions (for Google)
async function handleOAuthCallback(provider: string, code: string) {
  try {
    if (provider === "google") {
      return await handleGoogleOAuthCallback(code);
    }
    // Add other providers as needed (e.g., GitHub, etc.)
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { error: "OAuth callback failed" },
      { status: 500 }
    );
  }
}
