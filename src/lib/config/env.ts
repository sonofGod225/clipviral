import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config({ path: ".env.local" });

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().default("/dashboard"),
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().default("/dashboard"),
  GEMINI_API_KEY: z.string().min(1, "Gemini API key is required"),
});

function getEnvVariables() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => err.path.join('.'))
        .join(', ');
      throw new Error(
        `❌ Invalid environment variables: ${missingVars}\n` +
        'Please check your .env file and make sure all required variables are defined.'
      );
    }
    throw error;
  }
}

export const env = getEnvVariables(); 