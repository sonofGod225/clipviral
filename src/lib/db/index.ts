import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/lib/config/env';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);

export * from './schema/users';
export * from './schema/videos'; 