import { NextResponse } from "next/server";
import { redirectToGithubOAuth, handleGithubOAuthCallback } from "@/lib/session";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
  
    // 1. Redirect to Google OAuth login if no code is provided
    if (!code) {
      const googleOAuthUrl = await redirectToGithubOAuth();
      return NextResponse.redirect(googleOAuthUrl);
    }
  
    // 2. Handle callback with authorization code from Google
    const response = NextResponse.redirect("/dashboard");
    await handleGithubOAuthCallback(code, response);
    return response;
  }
  