import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { notionCredentials } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db
      .delete(notionCredentials)
      .where(eq(notionCredentials.userId, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting Notion:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Notion" },
      { status: 500 },
    );
  }
}
