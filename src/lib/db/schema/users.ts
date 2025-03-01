import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { videos } from "./videos";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  credits: integer("credits").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  videos: many(videos),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert; 