import {
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import type { Group, UserSizes } from "../models";

export const users = pgTable("users", {
    id: text().primaryKey().notNull(),
    name: text().unique(),
    username: text("user_name").notNull().unique(),
    partnerId: text("partner_id"),
    groups: jsonb().notNull().$type<Group[]>(),
    hue: integer().default(145).notNull(),
    sizes: jsonb().$type<UserSizes>(),
    hashedPassword: varchar("hashed_password", {
        length: 255,
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const authSessions = pgTable("sessions", {
    id: text().primaryKey().notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
});

export type AuthSession = typeof authSessions.$inferSelect;
