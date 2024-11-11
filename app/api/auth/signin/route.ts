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

// Helper to set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

export async function POST(request: Request) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return setCorsHeaders(new NextResponse(null, { status: 204 }));
  }

  try {
    const body = await request.json();
    const { email, password, provider, code } = body;

    // Handle OAuth login if `provider` is specified
    if (provider === "google") {
      if (code) {
        const response = NextResponse.redirect("/dashboard");
        await handleGoogleOAuthCallback(code, response);
        return setCorsHeaders(response);
      } else {
        const googleOAuthUrl = await redirectToGoogleOAuth();
        return setCorsHeaders(NextResponse.redirect(googleOAuthUrl));
      }
    } else if (provider === "github") {
      if (code) {
        const response = NextResponse.redirect("/dashboard");
        await handleGithubOAuthCallback(code, response);
        return setCorsHeaders(response);
      } else {
        const githubOAuthUrl = await redirectToGithubOAuth();
        return setCorsHeaders(NextResponse.redirect(githubOAuthUrl));
      }
    }

    // Validate email/password input for standard sign-in
    const validationResult = authSchema.safeParse({ email, password });
    if (!validationResult.success) {
      return setCorsHeaders(new NextResponse(
        JSON.stringify({ error: validationResult.error.issues }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Find the user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return setCorsHeaders(new NextResponse(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash || "");
    if (!passwordMatch) {
      return setCorsHeaders(new NextResponse(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      ));
    }

    // Create session for the user
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    await createSession(user.id, response);
    return setCorsHeaders(response);

  } catch (error) {
    console.error("Error during sign-in:", error);
    return setCorsHeaders(new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    ));
  }
}
