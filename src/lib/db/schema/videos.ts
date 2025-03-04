import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export const videos = pgTable('videos', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: text('user_id').notNull(),
  title: text('title').notNull(),
  prompt: text('prompt').notNull(),
  raw_prompt: text('raw_prompt').notNull(),
  status: text('status').notNull().default('draft'),
  step: text('step').notNull().default('script_review'),
  settings: jsonb('settings').$type<{
    tone: string;
    style: string;
    targetAudience: string;
    duration: number;
  }>(),
  scenes: jsonb('scenes').$type<Array<{
    text: string;
    prompt: string;
    imageUrl?: string;
    audioUrl?: string;
    duration: number;
  }>>().default([]),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;

export type VideoSettings = {
  tone: string;
  style: string;
  targetAudience: string;
  duration: number;
};

export type VideoScene = {
  text: string;
  prompt: string;
  imageUrl?: string;
  audioUrl?: string;
  duration: number;
};

export type CreateVideoInput = {
  user_id: string;
  title: string;
  prompt: string;
  raw_prompt: string;
  settings: VideoSettings;
  scenes?: VideoScene[];
};