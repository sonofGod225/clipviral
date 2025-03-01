'use server'

import { db } from "@/lib/db";
import { users, type User, type NewUser } from "@/lib/db/schema/users";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getUserById(id: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function createUser(user: NewUser): Promise<User> {
  const result = await db.insert(users).values(user).returning();
  return result[0];
}

export async function updateUser(id: string, user: Partial<NewUser>): Promise<User> {

  // update clerk user
  const clerk = await clerkClient();
  await clerk.users.updateUser(id, {
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
  });
  
  const result = await db
    .update(users)
    .set({ ...user, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}

export async function updateUserCredits(id: string, amount: number): Promise<User> {
  const result = await db
    .update(users)
    .set({ 
      credits: amount,
      updatedAt: new Date()
    })
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function deductCredits(id: string, amount: number): Promise<User> {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");
  if (user.credits < amount) throw new Error("Insufficient credits");

  return updateUserCredits(id, user.credits - amount);
}

export async function addCredits(id: string, amount: number): Promise<User> {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");

  return updateUserCredits(id, user.credits + amount);
} 