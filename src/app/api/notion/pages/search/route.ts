import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Client } from "@notionhq/client";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get search query from URL
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";

    // Get user's Notion credentials
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

    const notion = new Client({ auth: credentials[0].integrationKey });

    // Search Notion pages with the query
    const response = await notion.search({
      query: query,
      filter: {
        property: "object",
        value: "page",
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time",
      },
      page_size: 10, // Limit results for better performance
    });

    // Format the response
    const pages = response.results.map((page: any) => {
      // Get the title (handles different page structures)
      let title = "Untitled";

      // For pages with standard title property
      if (page.properties?.title?.title?.[0]?.plain_text) {
        title = page.properties.title.title[0].plain_text;
      }
      // For pages with Name property instead of title
      else if (page.properties?.Name?.title?.[0]?.plain_text) {
        title = page.properties.Name.title[0].plain_text;
      }
      // For database items with other property types
      else {
        // Try to find any property that might contain a name/title
        const firstTextProperty = Object.values(page.properties || {}).find(
          (prop: any) =>
            prop?.title?.[0]?.plain_text || prop?.rich_text?.[0]?.plain_text,
        );

        if (firstTextProperty) {
          if ((firstTextProperty as any).title?.[0]?.plain_text) {
            title = (firstTextProperty as any).title[0].plain_text;
          } else if ((firstTextProperty as any).rich_text?.[0]?.plain_text) {
            title = (firstTextProperty as any).rich_text[0].plain_text;
          }
        }
      }

      return {
        id: page.id,
        title: title,
        lastEdited: page.last_edited_time,
      };
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error searching Notion pages:", error);
    return NextResponse.json(
      {
        error: "Failed to search Notion pages",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
