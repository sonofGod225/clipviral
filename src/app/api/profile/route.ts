import { supabase } from "@/lib/supabase/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { first_name, last_name } = body;

    const { error } = await supabase
      .from("users")
      .update({
        first_name: first_name,
        last_name: last_name,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_id", userId);

    if (error) throw error;

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 