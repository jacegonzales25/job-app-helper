import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./lib/session";

export default async function middelware(req: NextRequest) {
  // 1. Check if route is protected
  const protectedRoutes = ["/dashboard"];
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(currentPath);

  if (isProtectedRoute) {
    // 2. Check for valid session
    const cookie = cookies().get("session")?.value;
    const session = await decrypt(cookie as string);
    // 3. If session is invalid, redirect to login
    if (!session?.userId) {
      return NextResponse.redirect(new URL("/auth/login"));
    }
  }
  // 4. Render route
  return NextResponse.next();
}

// Routes middleware should (not) run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
