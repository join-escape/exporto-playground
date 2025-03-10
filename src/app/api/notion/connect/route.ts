import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error connecting Notion:", error);
    return NextResponse.json(
      { error: "Failed to save Notion credentials" },
      { status: 500 },
    );
  }
}
