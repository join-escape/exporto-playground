// src/app/api/notion/verify/route.ts
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

export async function POST(request: Request) {
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

    // Initialize Notion client
    const notion = new Client({ auth: integrationKey });

    // Verify the integration key by making a light API call
    // We'll use the users.list endpoint as it's lightweight
    try {
      const response = await notion.users.list({ page_size: 1 });

      // Extract workspace information from the bot user
      const botUser = response.results.find((user) => user.type === "bot");
      const workspace = {
        id: "unknown",
        name: botUser?.name || `Notion Workspace`,
      };

      return NextResponse.json({
        success: true,
        workspace,
      });
    } catch (error: any) {
      console.error("Notion API error:", error);

      // Check for specific error types from Notion API
      if (error.status === 401) {
        return NextResponse.json(
          { error: "Invalid integration key" },
          { status: 401 },
        );
      }

      return NextResponse.json(
        { error: "Failed to verify with Notion API" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error verifying Notion integration:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
