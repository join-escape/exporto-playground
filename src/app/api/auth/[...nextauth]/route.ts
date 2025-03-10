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
    // @ts-ignore
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        try {
          // Check if a user with this email already exists
          let existingUser = null;
          if (user.email) {
            // First try to find by email (to prevent duplicates across providers)
            const usersByEmail = await db
              .select()
              .from(users)
              .where(eq(users.email, user.email))
              .limit(1);

            if (usersByEmail.length > 0) {
              existingUser = usersByEmail[0];
              // Use the existing user ID
              token.id = existingUser.id;

              // Check if this account already exists
              const existingAccount = await db
                .select()
                .from(accounts)
                .where(
                  and(
                    eq(accounts.provider, account.provider),
                    eq(accounts.providerAccountId, account.providerAccountId),
                  ),
                )
                .limit(1);

              // If the account doesn't exist, link it to the existing user
              if (existingAccount.length === 0) {
                await db.insert(accounts).values({
                  id: crypto.randomUUID(),
                  userId: existingUser.id,
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
              }

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
            // Check if user exists by ID (fallback)
            const userById = await db
              .select()
              .from(users)
              .where(eq(users.id, user.id))
              .limit(1);

            if (userById.length === 0) {
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
            } else {
              token.id = userById[0].id;
            }
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
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
