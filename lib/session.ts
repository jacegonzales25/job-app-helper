import "server-only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { sessions } from "@/server/db/schema"; // Import the sessions table
import { db } from "@/server/db"; // Your database instance
import { eq } from "drizzle-orm";
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
export async function createSession(userId: number) {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + cookie.duration);

  // Store the session in the database
  await db.insert(sessions).values({
    userId,
    sessionToken,
    expiresAt: expires,
  });

  // Set the session cookie
  cookies().set(cookie.name, sessionToken, { ...cookie.options, expires });
  redirect("/dashboard");
}

export async function verifySession() {
  const sessionToken = cookies().get(cookie.name)?.value;

  if (!sessionToken) {
    redirect("/auth/login");
  }

  // Fetch the session from the database
  const session = await db.query.sessions.findFirst({
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
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  }

  // Delete the session cookie
  cookies().delete(cookie.name);
  redirect("/auth/login");
}
