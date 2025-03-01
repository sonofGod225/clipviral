import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const videos = pgTable('videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  prompt: text('prompt').notNull(),
  status: text('status').notNull().default('draft'),
  settings: jsonb('settings').$type<{
    tone?: string;
    style?: string;
    targetAudience?: string;
    duration?: number;
  }>(),
  scenes: jsonb('scenes').$type<Array<{
    id: string;
    text: string;
    imageUrl?: string;
    audioUrl?: string;
    duration: number;
  }>>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 