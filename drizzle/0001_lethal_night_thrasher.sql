ALTER TABLE "maintenance" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "maintenance" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "groups" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "gift_items" DROP COLUMN "pic";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN "group";