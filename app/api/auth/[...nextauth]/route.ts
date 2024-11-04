// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
// Create the handler using `authOptions`
const handler = NextAuth(authOptions);

// Export HTTP method handlers
export { handler as GET, handler as POST };
