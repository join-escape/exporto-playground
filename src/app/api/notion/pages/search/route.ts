import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export async function GET(request: Request) {
  // Handle authenticated requests
  const session = await getServerSession(authOptions);
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "";

  // If authenticated, get integration key from database
  if (session?.user?.id) {
    try {
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

      return await searchNotionPages(credentials[0].integrationKey, query);
    } catch (error) {
      console.error("Error searching Notion pages:", error);
      return NextResponse.json(
        { error: "Failed to search Notion pages" },
        { status: 500 },
      );
    }
  } else {
    // For GET requests without auth, return error - they should use POST
    return NextResponse.json(
      { error: "Authentication required or use POST with integrationKey" },
      { status: 401 },
    );
  }
}

export async function POST(request: Request) {
  // Handle unauthenticated requests with integration key
  try {
    const { integrationKey } = await request.json();
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";

    if (!integrationKey) {
      return NextResponse.json(
        { error: "Integration key is required" },
        { status: 400 },
      );
    }

    return await searchNotionPages(integrationKey, query);
  } catch (error) {
    console.error("Error searching Notion pages:", error);
    return NextResponse.json(
      { error: "Failed to search Notion pages" },
      { status: 500 },
    );
  }
}

// Helper function to search Notion pages
async function searchNotionPages(integrationKey: string, query: string) {
  const notion = new Client({ auth: integrationKey });

  // If query looks like a page ID (UUID format or contains dashes)
  const isPageId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      query,
    ) ||
    (query.length > 30 && query.includes("-"));

  try {
    // If it's a possible page ID, try to retrieve it directly first
    if (isPageId) {
      try {
        const page = await notion.pages.retrieve({ page_id: query });
        if (page) {
          // Format the direct page result
          const formattedPage = formatPage(page as PageObjectResponse);
          return NextResponse.json({ pages: [formattedPage] });
        }
      } catch (error) {
        // If direct retrieval fails, continue with search
        console.log("Direct page retrieval failed, continuing with search");
      }
    }

    // Search pages with the query
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
      page_size: 10,
    });

    // Format the response
    const pages = response.results
      .filter(
        (result): result is PageObjectResponse => result.object === "page",
      )
      .map(formatPage);

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error searching Notion pages:", error);
    return NextResponse.json(
      { error: "Failed to search Notion pages" },
      { status: 500 },
    );
  }
}

// Helper function to format a page response
function formatPage(page: PageObjectResponse) {
  // Get the title (handles different page structures)
  let title = "Untitled";

  // For pages with standard title property
  if (
    page.properties?.title?.type === "title" &&
    page.properties.title.title[0]?.plain_text
  ) {
    title = page.properties.title.title[0].plain_text;
  }
  // For pages with Name property instead of title
  else if (
    page.properties?.Name?.type === "title" &&
    page.properties.Name.title[0]?.plain_text
  ) {
    title = page.properties.Name.title[0].plain_text;
  }
  // For database items with other property types
  else {
    // Try to find any property that might contain a name/title
    const properties = Object.values(page.properties || {});
    for (const prop of properties) {
      if (prop.type === "title" && prop.title[0]?.plain_text) {
        title = prop.title[0].plain_text;
        break;
      } else if (prop.type === "rich_text" && prop.rich_text[0]?.plain_text) {
        title = prop.rich_text[0].plain_text;
        break;
      }
    }
  }

  return {
    id: page.id,
    title: title,
    lastEdited: page.last_edited_time,
    // Add icon if available
    icon: page.icon?.type === "emoji" ? page.icon.emoji : undefined,
  };
}
