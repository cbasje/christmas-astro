CREATE TABLE "ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" text,
	"recipient_id" text NOT NULL,
	"gifted_by_id" text,
	"link" text,
	"gift_item_id" text,
	"purchased" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance" (
	"id" serial PRIMARY KEY NOT NULL,
	"start" timestamp DEFAULT now() NOT NULL,
	"end" timestamp,
	"reason" jsonb
);
--> statement-breakpoint
CREATE TABLE "gift_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" text,
	"notes" text,
	"recipient_id" text NOT NULL,
	"gifted_by_id" text,
	"link" text,
	"pic" text,
	"purchased" boolean DEFAULT false NOT NULL,
	"idea_link_id" text,
	"groups" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"group" text,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"user_name" text NOT NULL,
	"partner_id" text,
	"groups" jsonb,
	"hue" integer DEFAULT 145 NOT NULL,
	"sizes" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"hashed_password" varchar(255),
	CONSTRAINT "users_name_unique" UNIQUE("name"),
	CONSTRAINT "users_user_name_unique" UNIQUE("user_name")
);
--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_gifted_by_id_users_id_fk" FOREIGN KEY ("gifted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_gift_item_id_gift_items_id_fk" FOREIGN KEY ("gift_item_id") REFERENCES "public"."gift_items"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "gift_items" ADD CONSTRAINT "gift_items_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "gift_items" ADD CONSTRAINT "gift_items_gifted_by_id_users_id_fk" FOREIGN KEY ("gifted_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
