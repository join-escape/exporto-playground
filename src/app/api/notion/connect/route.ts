import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Client } from "@notionhq/client";

export async function POST(request: Request) {
  // Try to get the user session
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user?.id;

  try {
    const { integrationKey } = await request.json();

    if (!integrationKey || typeof integrationKey !== "string") {
      return NextResponse.json(
        { error: "Valid integration key is required" },
        { status: 400 },
      );
    }

    // Basic validation for Notion integration key format
    if (!integrationKey.startsWith("secret_")) {
      return NextResponse.json(
        { error: "Invalid Notion integration key format" },
        { status: 400 },
      );
    }

    // Verify the key works by trying to access Notion API
    try {
      const notion = new Client({ auth: integrationKey });
      // Make a simple API call to verify the key works
      const response = await notion.users.list({ page_size: 1 });

      // Get the bot user to display workspace info
      const botUser = response.results.find((user) => user.type === "bot");
      const workspace = botUser
        ? {
            id: botUser.id,
            name: botUser.name,
          }
        : undefined;

      // If authenticated, store the key
      if (isAuthenticated) {
        // Check if user already has a credential
        const existingCredential = await db
          .select()
          .from(notionCredentials)
          .where(eq(notionCredentials.userId, session.user.id))
          .limit(1);

        if (existingCredential.length > 0) {
          // Update existing credential
          await db
            .update(notionCredentials)
            .set({ integrationKey })
            .where(eq(notionCredentials.id, existingCredential[0].id));
        } else {
          // Create new credential
          await db.insert(notionCredentials).values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            integrationKey,
            createdAt: new Date(),
          });
        }
      }

      return NextResponse.json({
        isConnected: true,
        workspace,
      });
    } catch (error) {
      console.error("Error verifying Notion key:", error);
      return NextResponse.json(
        { error: "Invalid or unauthorized Notion integration key" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
