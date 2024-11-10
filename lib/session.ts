import "server-only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { sessions } from "@/server/db/schema"; // Import the sessions table
import * as db from "@/server/db"; // Your database instance
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import axios from "axios";

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
// Type assertion to avoid TypeScript error

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

// Transition to stateful session handling as opposed to stateless JWT
export async function createSession(
  userId: number,
  response?: NextResponse
): Promise<string> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + cookie.duration);

  // Store the session in the database
  await db.db.insert(sessions).values({
    userId,
    sessionToken,
    expiresAt,
  });

  // Set the session token in the response cookie if response is provided
  response?.cookies.set(cookie.name, sessionToken, {
    ...cookie.options,
    expires: expiresAt,
  });

  return sessionToken;
}
export async function verifySession() {
  const sessionToken = cookies().get(cookie.name)?.value;

  if (!sessionToken) {
    redirect("/auth/login");
  }

  // Fetch the session from the database
  const session = await db.db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.sessionToken, sessionToken),
  });

  if (!session || session.expiresAt < new Date()) {
    // Session is invalid or expired
    redirect("/auth/login");
  }

  // Optionally, refresh the session expiration here

  return { userId: session.userId };
}

export async function deleteSession() {
  const sessionToken = cookies().get(cookie.name)?.value;

  if (sessionToken) {
    // Delete the session from the database
    await db.db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  }

  // Delete the session cookie
  cookies().delete(cookie.name);
  redirect("/auth/login");
}

// OAuth 2.0 helper functions
export async function redirectToGoogleOAuth() {
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.append("client_id", process.env.GOOGLE_CLIENT_ID!);
  googleAuthUrl.searchParams.append(
    "redirect_uri",
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`
  );
  googleAuthUrl.searchParams.append("response_type", "code");
  googleAuthUrl.searchParams.append("scope", "openid email profile");

  return googleAuthUrl.toString(); // Return the URL to redirect to
}

export async function handleGoogleOAuthCallback(
  code: string,
  response: NextResponse
) {
  try {
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`,
          grant_type: "authorization_code",
          code,
        },
      }
    );

    const { access_token } = tokenResponse.data;
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const { email, id: oauthId } = userInfoResponse.data;

    let user = await db.db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(eq(users.email, email), eq(users.oauthProvider, "google")),
    });

    if (!user) {
      user = await db.insertUser({
        email,
        oauthProvider: "google",
        oauthId,
        createdAt: new Date(),
      });
    }

    const sessionToken = await createSession(user.id, response);
    await db.insertSession({
      userId: user.id,
      sessionToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    });

    return { status: 200, message: "OAuth login successful" };
  } catch (error) {
    console.error("OAuth login error:", error);
    return { status: 500, error: "OAuth login failed" };
  }
}
