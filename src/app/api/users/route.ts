import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { createUser, getUserById } from "@/db/services/users";

const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  imageUrl: z.string().url().optional(),
  credits: z.number().int().min(0).optional(),
});

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = createUserSchema.parse(json);

    const existingUser = await getUserById(userId);
    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const user = await createUser({
      id: userId,
      ...body,
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
} 