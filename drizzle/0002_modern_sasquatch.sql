CREATE TABLE "prompt_parameters" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"translations" jsonb NOT NULL,
	"options" jsonb NOT NULL,
	"default_value" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quick_prompts" (
	"id" text PRIMARY KEY NOT NULL,
	"translations" jsonb NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
