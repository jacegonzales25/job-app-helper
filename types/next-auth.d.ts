// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Define user ID type here
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string; // Define user ID type here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
