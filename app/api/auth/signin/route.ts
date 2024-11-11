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
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const body = await request.json();
    const { email, password, provider, code } = body;

    // Handle OAuth login if `provider` is specified
    if (provider === "google") {
      if (code) {
        const response = NextResponse.redirect("/dashboard");
        await handleGoogleOAuthCallback(code, response);
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return response;
      } else {
        const googleOAuthUrl = await redirectToGoogleOAuth();
        return NextResponse.redirect(googleOAuthUrl);
      }
    } else if (provider === "github") {
      if (code) {
        const response = NextResponse.redirect("/dashboard");
        await handleGithubOAuthCallback(code, response);
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return response;
      } else {
        const githubOAuthUrl = await redirectToGithubOAuth();
        return NextResponse.redirect(githubOAuthUrl);
      }
    }

    // Validate email/password input for standard sign-in
    const validationResult = authSchema.safeParse({ email, password });
    if (!validationResult.success) {
      return new NextResponse(JSON.stringify({ error: validationResult.error.issues }), {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Find the user by email
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "Invalid email or password" }), {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash || "");
    if (!passwordMatch) {
      return new NextResponse(JSON.stringify({ error: "Invalid email or password" }), {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Create session for the user
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
    await createSession(user.id, response);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return response;
  } catch (error) {
    console.error("Error during sign-in:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
}
