CREATE TYPE "public"."Group" AS ENUM('BENJAMINS', 'HAUGEN');--> statement-breakpoint
CREATE TABLE "secret_santa_picks" (
	"id" serial PRIMARY KEY NOT NULL,
	"outline" jsonb NOT NULL,
	"deadline" timestamp NOT NULL,
	"group" "Group",
	"created_at" timestamp DEFAULT now()
);
