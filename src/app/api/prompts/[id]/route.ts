import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { quickPrompts } from "@/lib/db/schema/prompts";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.delete(quickPrompts).where(eq(quickPrompts.id, params.id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PROMPT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { translations, category } = body;

    await db
      .update(quickPrompts)
      .set({
        translations,
        category,
        updatedAt: new Date(),
      })
      .where(eq(quickPrompts.id, params.id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PROMPT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 