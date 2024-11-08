import "server-only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export async function createSession(userId: number) {
  // Implement session creation logic
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({ userId, expires });
  cookies().set(cookie.name, session, { ...cookie.options, expires });
  redirect("/dashboard");
}

export async function verifySession() {
  // Implement session verification logic
  // Use a different variable name to avoid shadowing
  const sessionCookie = cookies().get(cookie.name)?.value;

  if (!sessionCookie) {
    // If no cookie is found, redirect to login
    redirect("/auth/login");
    return;
  }

  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect("/auth/login");
  }

  return { userId: session.userId };
}

export async function deleteSession() {
  // Implement session deletion logic
  cookies().delete(cookie.name);
  redirect("/auth/login");
}
