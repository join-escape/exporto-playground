import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Client } from "@notionhq/client";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ isConnected: false });
  }

  try {
    // Check if user has Notion credentials
    const credentials = await db
      .select()
      .from(notionCredentials)
      .where(eq(notionCredentials.userId, session.user.id))
      .limit(1);

    if (credentials.length === 0) {
      return NextResponse.json({ isConnected: false });
    }

    // Verify the key is still valid
    const integrationKey = credentials[0].integrationKey;
    try {
      const notion = new Client({ auth: integrationKey });
      const response = await notion.users.list({ page_size: 1 });

      // Get the bot user to display workspace info
      const botUser = response.results.find((user) => user.type === "bot");

      return NextResponse.json({
        isConnected: true,
        workspace: {
          id: botUser?.id,
          name:
            botUser?.name || credentials[0].workspaceName || "Notion Workspace",
        },
      });
    } catch (error) {
      // If the key is no longer valid, clean up the invalid credential
      await db
        .delete(notionCredentials)
        .where(eq(notionCredentials.id, credentials[0].id));

      return NextResponse.json({ isConnected: false });
    }
  } catch (error) {
    console.error("Error checking Notion status:", error);
    return NextResponse.json({ isConnected: false });
  }
}
