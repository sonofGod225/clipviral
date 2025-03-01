import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { getUserById, updateUser, deleteUser } from "@/db/services/users";

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.string().url().optional(),
  credits: z.number().int().min(0).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only allow users to access their own data
    if (currentUserId !== params.userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const user = await getUserById(params.userId);
    if (!user) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only allow users to update their own data
    if (currentUserId !== params.userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const json = await req.json();
    const body = updateUserSchema.parse(json);

    const user = await updateUser(params.userId, body);
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Only allow users to delete their own account
    if (currentUserId !== params.userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await deleteUser(params.userId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 