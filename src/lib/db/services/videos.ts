'use server'

import { videos } from '@/lib/db/schema/videos';
import { eq } from 'drizzle-orm';
import { Video, CreateVideoInput, NewVideo } from '@/lib/db/schema/videos';
import { db } from '..';

export async function getVideosByUserId(userId: string): Promise<Video[]> {
  const results = await db.select().from(videos).where(eq(videos.user_id, userId));
  return results;
}

export async function getVideoById(id: string): Promise<Video | null> {
  const results = await db.select().from(videos).where(eq(videos.id, id));
  return results[0] || null;
}

export async function createVideo(data: CreateVideoInput): Promise<Video> {
  const [result] = await db.insert(videos).values({
    ...data,
    status: 'draft',
    step: 'script_review',
    scenes: data.scenes || []
  }).returning();
  return result;
}

export async function updateVideo(id: string, data: Partial<NewVideo>): Promise<Video> {
  const [result] = await db.update(videos)
    .set({
      ...data,
      updated_at: new Date()
    })
    .where(eq(videos.id, id))
    .returning();
  return result;
}

export async function deleteVideo(id: string): Promise<void> {
  await db.delete(videos).where(eq(videos.id, id));
} 