import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { Client } from "@notionhq/client";
import { eq } from "drizzle-orm";

// Environment variables for Notion OAuth
const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID || "";
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.NOTION_REDIRECT_URI || "";

export async function GET(request: NextRequest) {
  // Extract query parameters
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle Notion errors
  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/playground?error=${encodeURIComponent(
        `Notion OAuth Error: ${error}`,
      )}`,
    );
  }

  // Validate required parameters
  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/playground?error=${encodeURIComponent(
        "Invalid callback: missing parameters",
      )}`,
    );
  }

  // Validate state parameter to prevent CSRF
  let stateData;
  try {
    stateData = JSON.parse(Buffer.from(state, "base64").toString());

    // Validate that state isn't too old (e.g., 10 minutes)
    const timestamp = stateData.timestamp || 0;
    const now = Date.now();
    if (now - timestamp > 10 * 60 * 1000) {
      throw new Error("State expired");
    }
  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/playground?error=${encodeURIComponent(
        "Invalid or expired session state",
      )}`,
    );
  }

  // Validate required configuration
  if (!NOTION_CLIENT_ID || !NOTION_CLIENT_SECRET || !REDIRECT_URI) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/playground?error=${encodeURIComponent(
        "Notion OAuth configuration is incomplete",
      )}`,
    );
  }

  try {
    // Exchange the authorization code for an access token
    const response = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Notion responded with ${response.status}: ${JSON.stringify(error)}`,
      );
    }

    const tokenData = await response.json();
    const { access_token, workspace_id, workspace_name, owner } = tokenData;

    // Verify the token by making a simple API call
    const notion = new Client({ auth: access_token });
    await notion.users.list({ page_size: 1 });

    // Store the token in the database for the user
    const userId = stateData.userId;

    // Check if user already has credentials
    const existingCredential = await db
      .select()
      .from(notionCredentials)
      .where(eq(notionCredentials.userId, userId))
      .limit(1);

    if (existingCredential.length > 0) {
      // Update existing credentials
      await db
        .update(notionCredentials)
        .set({
          integrationKey: access_token,
          createdAt: new Date(),
        })
        .where(eq(notionCredentials.id, existingCredential[0].id));
    } else {
      // Create new credentials
      await db.insert(notionCredentials).values({
        id: crypto.randomUUID(),
        userId,
        integrationKey: access_token,
        createdAt: new Date(),
      });
    }

    // Redirect back to the playground with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/playground?success=notion-connected&workspace=${encodeURIComponent(
        workspace_name || "Notion Workspace",
      )}`,
    );
  } catch (error) {
    console.error("Error in Notion OAuth callback:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/playground?error=${encodeURIComponent(
        error instanceof Error ? error.message : "Failed to connect to Notion",
      )}`,
    );
  }
}
