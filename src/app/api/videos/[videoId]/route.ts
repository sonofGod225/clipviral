import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import * as z from "zod";
import { getVideoById, updateVideo, deleteVideo } from "@/db/services/videos";

const updateVideoSchema = z.object({
  title: z.string().min(1).optional(),
  prompt: z.string().min(1).optional(),
  status: z.enum(["draft", "processing", "completed", "failed"]).optional(),
  settings: z.object({
    tone: z.string().optional(),
    style: z.string().optional(),
    targetAudience: z.string().optional(),
    duration: z.number().min(15).max(300).optional(),
  }).optional(),
  scenes: z.array(z.object({
    id: z.string(),
    text: z.string(),
    imageUrl: z.string().optional(),
    audioUrl: z.string().optional(),
    duration: z.number(),
  })).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const video = await getVideoById(params.videoId);
    if (!video) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (video.userId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(video);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = updateVideoSchema.parse(json);

    const video = await getVideoById(params.videoId);
    if (!video) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (video.userId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedVideo = await updateVideo(params.videoId, body);
    return NextResponse.json(updatedVideo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 });
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const video = await getVideoById(params.videoId);
    if (!video) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (video.userId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await deleteVideo(params.videoId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 