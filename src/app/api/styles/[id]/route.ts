import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { visualStyles } from "@/lib/db/schema/prompts";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, sessionClaims } = auth();

    if (!userId || !sessionClaims?.metadata?.role?.includes('superadmin')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.delete(visualStyles).where(eq(visualStyles.id, params.id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STYLE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, sessionClaims } = auth();

    if (!userId || !sessionClaims?.metadata?.role?.includes('superadmin')) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { translations, imageUrl, order } = body;

    await db
      .update(visualStyles)
      .set({
        translations,
        imageUrl,
        order,
        updatedAt: new Date(),
      })
      .where(eq(visualStyles.id, params.id));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[STYLE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 