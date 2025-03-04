CREATE TABLE "visual_styles" (
	"id" text PRIMARY KEY NOT NULL,
	"translations" jsonb NOT NULL,
	"image_url" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
