// app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { db } from "@/server/db";
import {
  createSession,
  redirectToGoogleOAuth,
  redirectToGithubOAuth,
  handleGoogleOAuthCallback,
  handleGithubOAuthCallback,
} from "@/lib/session";
import { authSchema } from "@/server/definitions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, provider, code } = body;

    // Handle OAuth login if `provider` is specified
    if (provider === "google") {
      if (code) {
        const response = NextResponse.redirect("/dashboard"); // Set redirect after successful OAuth login
        await handleGoogleOAuthCallback(code, response);
        return response;
      } else {
        const googleOAuthUrl = await redirectToGoogleOAuth();
        return NextResponse.redirect(googleOAuthUrl);
      }
    } else if (provider === "github") {
      if (code) {
        const response = NextResponse.redirect("/dashboard"); // Set redirect after successful OAuth login
        await handleGithubOAuthCallback(code, response);
        return response;
      } else {
        const githubOAuthUrl = await redirectToGithubOAuth();
        return NextResponse.redirect(githubOAuthUrl);
      }
    }

    // Validate email/password input for standard sign-in
    const validationResult = authSchema.safeParse({ email, password });
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
    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` // Use environment variable for base URL
    );
    await createSession(user.id, response);

    return NextResponse.json({
      success: true,
      redirectUrl: "https://job-app-helper.vercel.app//dashboard",
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
