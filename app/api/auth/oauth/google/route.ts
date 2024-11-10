// app/api/auth/oauth/google/route.ts
import { NextResponse } from "next/server";
import { redirectToGoogleOAuth, handleGoogleOAuthCallback } from "@/lib/session";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // 1. Redirect to Google OAuth login if no code is provided
  if (!code) {
    const googleOAuthUrl = await redirectToGoogleOAuth();
    return NextResponse.redirect(googleOAuthUrl);
  }

  // 2. Handle callback with authorization code from Google
  const response = NextResponse.redirect("/dashboard");
  await handleGoogleOAuthCallback(code, response);
  return response;
}
