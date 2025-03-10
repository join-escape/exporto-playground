import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { users, accounts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // Add signIn callback to check for existing accounts with the same email
    // @ts-ignore
    async signIn({ user, account }) {
      if (!user.email) {
        return true; // Allow sign in without email (rare case)
      }

      try {
        // Check if a user with this email already exists
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (existingUsers.length > 0) {
          const existingUser = existingUsers[0];

          // Find which provider the existing user is using
          const existingAccounts = await db
            .select()
            .from(accounts)
            .where(eq(accounts.userId, existingUser.id));

          // If user exists but is using a different provider
          if (
            existingAccounts.length > 0 &&
            !existingAccounts.some((acc) => acc.provider === account.provider)
          ) {
            const existingProvider = existingAccounts[0].provider;
            throw new Error(
              `This email is already associated with a different provider.`,
            );
          }
        }

        return true;
      } catch (error: unknown) {
        console.error("Sign-in validation error:", error);
        // @ts-ignore
        return `/playground?error=${encodeURIComponent(error.message)}`;
      }
    },

    // @ts-ignore - Keep the existing JWT callback but simplify it
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        try {
          // Check if a user with this email already exists
          let existingUser = null;
          if (user.email) {
            // First try to find by email
            const usersByEmail = await db
              .select()
              .from(users)
              .where(eq(users.email, user.email))
              .limit(1);

            if (usersByEmail.length > 0) {
              existingUser = usersByEmail[0];
              // Use the existing user ID
              token.id = existingUser.id;

              // Update user profile if needed (e.g., new image)
              if (user.image && user.image !== existingUser.image) {
                await db
                  .update(users)
                  .set({ image: user.image })
                  .where(eq(users.id, existingUser.id));
              }
            }
          }

          // If no existing user was found, create a new one
          if (!existingUser) {
            // Create new user
            await db.insert(users).values({
              id: user.id,
              name: user.name || null,
              email: user.email || "",
              image: user.image || null,
            });

            // Create new account
            await db.insert(accounts).values({
              id: crypto.randomUUID(),
              userId: user.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token || null,
              refresh_token: account.refresh_token || null,
              expires_at: account.expires_at || null,
              token_type: account.token_type || null,
              scope: account.scope || null,
              id_token: account.id_token || null,
              session_state: account.session_state || null,
            });

            token.id = user.id;
          }
        } catch (error) {
          console.error("Error managing user data:", error);
        }

        return token;
      }

      return token;
    },

    // @ts-ignore
    async session({ session, token }) {
      if (token && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/playground", // Redirect to playground after sign in
    error: "/playground", // Redirect to playground on error
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
