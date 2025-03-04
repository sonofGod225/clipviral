import { NextResponse } from 'next/server';
import { createVideo } from '@/lib/db/services/videos';
import { auth } from '@clerk/nextjs/server';
import type { CreateVideoInput } from '@/lib/db/schema/videos';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const videoData: CreateVideoInput = {
      ...body,
      user_id: userId
    };

    const video = await createVideo(videoData);
    return NextResponse.json(video);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
} 