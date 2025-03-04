ALTER TABLE "videos" ADD COLUMN "raw_prompt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "step" text DEFAULT 'script_review' NOT NULL;