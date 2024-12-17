import { jsonb, pgEnum, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { Groups } from "./auth";

export const groupEnum = pgEnum("Group", Groups);

export const secretSantaPicks = pgTable("secret_santa_picks", {
    id: serial().primaryKey(),
    outline: jsonb().notNull().$type<Record<string, string>>(),
    deadline: timestamp().notNull(),
    group: groupEnum(),
    createdAt: timestamp("created_at").defaultNow(),
});
