import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { convertNotionPage } from "@/lib/notion-convert";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { pageId, format } = await request.json();

    if (!pageId) {
      return NextResponse.json(
        { error: "Page ID is required" },
        { status: 400 },
      );
    }

    // Get the user's Notion integration key from DB
    const credentials = await db
      .select()
      .from(notionCredentials)
      .where(eq(notionCredentials.userId, session.user.id))
      .limit(1);

    if (credentials.length === 0) {
      return NextResponse.json(
        { error: "Notion not connected" },
        { status: 400 },
      );
    }

    const integrationKey = credentials[0].integrationKey;

    // Convert the page
    const content = await convertNotionPage(integrationKey, pageId, format);

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error converting Notion page:", error);
    return NextResponse.json(
      {
        error: "Failed to convert Notion page",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
