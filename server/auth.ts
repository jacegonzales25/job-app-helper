// src/server/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, findOrCreateOAuthUser } from "@/server/db/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  adapter: DrizzleAdapter(db), // Drizzle ORM adapter
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback:", { user, account, profile });
      return true;
    },
    async session({ session, token }) {
      console.log("Session callback:", { session, token });
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback:", { token, user });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },  
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  debug: true,
};
