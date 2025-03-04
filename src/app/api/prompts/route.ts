import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quickPrompts } from "@/lib/db/schema/prompts";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const prompts = await db.select().from(quickPrompts);

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("[PROMPTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { translations, category } = body;

    const prompt = await db.insert(quickPrompts).values({
      translations,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return NextResponse.json(prompt[0]);
  } catch (error) {
    console.error("[PROMPT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 