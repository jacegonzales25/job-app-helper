import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth"; // Import the shared authOptions
import superjson from "superjson"; // Import superjson if needed

export const createTRPCContext = cache(async () => {
  // Retrieve user ID dynamically if using authentication
  const session = await getServerSession(authOptions);
  // Check if session exists and extract user ID
  const userId = session?.user?.id ?? null;

  return { userId };
});

const t = initTRPC.create({
  transformer: superjson, // Enable superjson transformer
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
