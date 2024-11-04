import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson'; // Import superjson if needed

export const createTRPCContext = cache(async () => {
  // Retrieve user ID dynamically if using authentication
  return { userId: 'user_123' };
});

const t = initTRPC.create({
  transformer: superjson, // Enable superjson transformer
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
