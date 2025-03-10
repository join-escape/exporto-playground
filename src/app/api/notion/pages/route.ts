import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Client } from "@notionhq/client";
import {
  SearchResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function GET() {
  return handleRequest();
}

export async function POST(request: Request) {
  const body = await request.json();
  return handleRequest(body?.integrationKey);
}

async function handleRequest(providedIntegrationKey?: string) {
  let integrationKey: string | null = providedIntegrationKey || null;

  // If no integration key provided, try to get from authenticated user
  if (!integrationKey) {
    const session = await getServerSession(authOptions);

    if (session?.user?.id) {
      // Get user's Notion credentials
      const credentials = await db
        .select()
        .from(notionCredentials)
        .where(eq(notionCredentials.userId, session.user.id))
        .limit(1);

      if (credentials.length > 0) {
        integrationKey = credentials[0].integrationKey;
      }
    }
  }

  // If still no integration key, return error
  if (!integrationKey) {
    return NextResponse.json(
      { error: "Notion integration key is required" },
      { status: 400 },
    );
  }

  try {
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
      .map((page) => {
        // Handle different types of page titles
        let title = "Untitled";

        // For pages with standard title property
        if (page.properties?.title?.type === "title") {
          title = page.properties.title.title[0]?.plain_text || "Untitled";
        }
        // For pages with Name property instead of title
        else if (page.properties?.Name?.type === "title") {
          title = page.properties.Name.title[0]?.plain_text || "Untitled";
        }
        // For database items with other property types
        else {
          // Try to find any property that might contain a name/title
          const properties = Object.values(page.properties || {});

          for (const prop of properties) {
            if (prop.type === "title" && prop.title[0]?.plain_text) {
              title = prop.title[0].plain_text;
              break;
            } else if (
              prop.type === "rich_text" &&
              prop.rich_text[0]?.plain_text
            ) {
              title = prop.rich_text[0].plain_text;
              break;
            }
          }
        }

        return {
          id: page.id,
          title,
          lastEdited: page.last_edited_time,
        };
      });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching Notion pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch Notion pages" },
      { status: 500 },
    );
  }
}
