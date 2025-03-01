'use server'

import { videos } from '@/lib/db/schema/videos';
import { eq } from 'drizzle-orm';
import { NewVideo, Video, CreateVideoData } from '@/features/videos/types';
import { db } from '..';
import { revalidatePath } from "next/cache";

export async function getVideosByUserId(userId: string): Promise<Video[]> {
  const results = await db.select().from(videos).where(eq(videos.userId, userId));
  return results as Video[];
}

export async function getVideoById(id: string): Promise<Video | undefined> {
  const results = await db.select().from(videos).where(eq(videos.id, id));
  return results[0] as Video | undefined;
}

export async function createVideo(data: CreateVideoData & { status: string }): Promise<Video> {
  const [result] = await db.insert(videos).values(data).returning();
  revalidatePath('/dashboard/videos');
  return result as Video;
}

export async function updateVideo(id: string, video: Partial<NewVideo>): Promise<Video> {
  const results = await db
    .update(videos)
    .set({ ...video, updatedAt: new Date() })
    .where(eq(videos.id, id))
    .returning();
  return results[0] as Video;
}

export async function deleteVideo(id: string): Promise<void> {
  await db.delete(videos).where(eq(videos.id, id));
} 