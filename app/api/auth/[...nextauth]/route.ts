import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db, findOrCreateOAuthUser } from "@/server/db/db";

const handler = NextAuth({
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
    async signIn({ user, account }) {
      // Use optional chaining to handle nullable properties
      if (account?.provider && account?.providerAccountId && user.email) {
        const oauthId = account.providerAccountId;
        const oauthProvider = account.provider;
        const email = user.email;

        // Use findOrCreateOAuthUser to check existence or create user
        await findOrCreateOAuthUser(email, oauthProvider, oauthId);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
