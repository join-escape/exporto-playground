import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Client } from "@notionhq/client";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  SearchResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Retrieve the user's Notion integration key
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

    // Initialize Notion client
    const notion = new Client({ auth: integrationKey });

    // Fetch pages from Notion
    const response: SearchResponse = await notion.search({
      filter: {
        property: "object",
        value: "page",
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
    });

    // Format the response
    const pages = response.results
      .filter(
        (result): result is PageObjectResponse => result.object === "page",
      )
      .map((page) => ({
        id: page.id,
        title:
          page.properties.title?.type === "title"
            ? page.properties.title.title[0]?.plain_text || "Untitled"
            : "Untitled",
        lastEdited: page.last_edited_time,
      }));

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching Notion pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch Notion pages" },
      { status: 500 },
    );
  }
}
