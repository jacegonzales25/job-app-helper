import "server-only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sessions } from "@/server/db/schema";
import * as db from "@/server/db"; // Your database instance
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Secret key for JWT signing and verification
const secretKey = process.env.SECRET_KEY;

// Function to get the key as Uint8Array
function getKey() {
  return new TextEncoder().encode(secretKey);
}

// Helper function to create a cookie
const cookie = {
  name: "session",
  options: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as "lax",
    path: "/",
  },
  duration: 24 * 60 * 60 * 1000,
};

export async function encrypt(payload: JWTPayload) {
  const key = getKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(session: string) {
  try {
    const key = getKey();
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// Generate a simple random session token
function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function createSession(userId: number, response?: NextResponse): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + cookie.duration);

  await db.db.insert(sessions).values({
    userId,
    sessionToken,
    expiresAt,
  });

  response?.cookies.set(cookie.name, sessionToken, {
    ...cookie.options,
    expires: expiresAt,
  });

  return sessionToken;
}

export async function verifySession() {
  const sessionToken = cookies().get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await db.db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.sessionToken, sessionToken),
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return { userId: session.userId };
}

export async function deleteSession() {
  const sessionToken = cookies().get(cookie.name)?.value;

  if (sessionToken) {
    await db.db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  }

  cookies().delete(cookie.name);
  redirect("/auth/login");
}

// OAuth Redirect for Google
export async function redirectToGoogleOAuth() {
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.append("client_id", process.env.GOOGLE_CLIENT_ID!);
  googleAuthUrl.searchParams.append(
    "redirect_uri",
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
  );
  googleAuthUrl.searchParams.append("response_type", "code");
  googleAuthUrl.searchParams.append("scope", "openid email profile");
  return googleAuthUrl.toString();
}

// Google OAuth Callback
export async function handleGoogleOAuthCallback(code: string, response: NextResponse) {
  return handleOAuthCallback("google", code, response);
}

// OAuth Redirect for GitHub
export async function redirectToGithubOAuth() {
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.append("client_id", process.env.GITHUB_CLIENT_ID!);
  githubAuthUrl.searchParams.append(
    "redirect_uri",
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/github`
  );
  githubAuthUrl.searchParams.append("scope", "read:user user:email");
  return githubAuthUrl.toString();
}

// GitHub OAuth Callback
export async function handleGithubOAuthCallback(code: string, response: NextResponse) {
  return handleOAuthCallback("github", code, response);
}

// General OAuth Callback Handler
async function handleOAuthCallback(
  provider: "google" | "github",
  code: string,
  response: NextResponse
) {
  try {
    const tokenUrl =
      provider === "google"
        ? "https://oauth2.googleapis.com/token"
        : "https://github.com/login/oauth/access_token";

    const userInfoUrl =
      provider === "google"
        ? "https://www.googleapis.com/oauth2/v2/userinfo"
        : "https://api.github.com/user";

    // Filter out undefined values
    const tokenParams = Object.entries({
      client_id: provider === "google" ? process.env.GOOGLE_CLIENT_ID : process.env.GITHUB_CLIENT_ID,
      client_secret: provider === "google" ? process.env.GOOGLE_CLIENT_SECRET : process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/${provider}`,
      code,
      ...(provider === "google" && { grant_type: "authorization_code" }),
    }).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    // Exchange code for access token
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenParams),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user info
    const userInfoResponse = await fetch(userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = await userInfoResponse.json();

    const email = provider === "google" ? userInfo.email : userInfo.email || userInfo.login;
    const oauthId = userInfo.id;

    // Find or create user
    let user = await db.db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(eq(users.email, email), eq(users.oauthProvider, provider)),
    });

    if (!user) {
      user = await db.insertUser({
        email,
        oauthProvider: provider,
        oauthId,
        createdAt: new Date(),
      });
    }

    // Create session for user
    const sessionToken = await createSession(user.id, response);
    await db.insertSession({
      userId: user.id,
      sessionToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    });

    return { status: 200, message: `${provider} OAuth login successful` };
  } catch (error) {
    console.error(`${provider} OAuth login error:`, error);
    return { status: 500, error: `${provider} OAuth login failed` };
  }
}
