import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visualStyles } from "@/lib/db/schema/prompts";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const styles = await db.select().from(visualStyles).orderBy(visualStyles.order);

    return NextResponse.json(styles);
  } catch (error) {
    console.error("[STYLES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { translations, imageUrl, order, prompt } = body;

    const style = await db.insert(visualStyles).values({
      prompt,
      translations,
      imageUrl,
      order,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json(style[0]);
  } catch (error) {
    console.error("[STYLE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 