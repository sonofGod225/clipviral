import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from 'uuid';

export const quickPrompts = pgTable("quick_prompts", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  translations: jsonb("translations").$type<{
    fr: { title: string; prompt: string };
    en: { title: string; prompt: string };
  }>().notNull(),
  category: text("category").notNull(), // 'business', 'personal', 'creative', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const promptParameters = pgTable("prompt_parameters", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  type: text("type").notNull(), // 'duration', 'tone', 'style', 'targetAudience', etc.
  translations: jsonb("translations").$type<{
    fr: { name: string; description: string };
    en: { name: string; description: string };
  }>().notNull(),
  options: jsonb("options").$type<{
    fr: Array<{ value: string; label: string }>;
    en: Array<{ value: string; label: string }>;
  }>().notNull(),
  defaultValue: text("default_value").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const visualStyles = pgTable("visual_styles", {
  id: text("id").primaryKey().$defaultFn(() => uuidv4()),
  translations: jsonb("translations").$type<{
    fr: { name: string; description: string };
    en: { name: string; description: string };
  }>().notNull(),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type QuickPrompt = typeof quickPrompts.$inferSelect;
export type NewQuickPrompt = typeof quickPrompts.$inferInsert;
export type PromptParameter = typeof promptParameters.$inferSelect;
export type NewPromptParameter = typeof promptParameters.$inferInsert;
export type VisualStyle = typeof visualStyles.$inferSelect;
export type NewVisualStyle = typeof visualStyles.$inferInsert; 