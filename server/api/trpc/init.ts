import { initTRPC } from '@trpc/server';
import { cache } from 'react';

// Create your tRPC context (can be asynchronous if needed)
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' }; // Add relevant context here
});

type Context = {
  user?: {
    id: string;
  };
};

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  // Add any transformers or middlewares here
  // transformer: superjson, // optional, depending on your needs
});

// Export factory to create a caller for server-side calls
export const createCallerFactory = (router) => {
  return (context) => router.createCaller(context);
};

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
