import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// Environment variables for Notion OAuth
const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID || "";
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.NOTION_REDIRECT_URI || "";

// Initiate OAuth flow
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!NOTION_CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json(
      { error: "Notion OAuth is not configured" },
      { status: 500 },
    );
  }

  // Generate state parameter to prevent CSRF attacks
  // We'll include the user ID in the state so we can identify them when they return
  const state = Buffer.from(
    JSON.stringify({
      userId: session.user.id,
      timestamp: Date.now(),
    }),
  ).toString("base64");

  // Construct the Notion authorization URL
  const notionAuthUrl = new URL("https://api.notion.com/v1/oauth/authorize");
  notionAuthUrl.searchParams.append("client_id", NOTION_CLIENT_ID);
  notionAuthUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  notionAuthUrl.searchParams.append("response_type", "code");
  notionAuthUrl.searchParams.append("state", state);

  // Return the auth URL - frontend will redirect to this
  return NextResponse.json({ authUrl: notionAuthUrl.toString() });
}
