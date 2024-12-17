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
    id: text("id").primaryKey().notNull(),
    name: text("name").unique(),
    username: text("user_name").notNull().unique(),
    partnerId: text("partner_id"),
    groups: jsonb("groups").notNull().$type<Group[]>(),
    hue: integer("hue").default(145).notNull(),
    sizes: jsonb("sizes").$type<UserSizes>(),
    hashedPassword: varchar("hashed_password", {
        length: 255,
    }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// export const selectUserSchema = createSelectSchema(users);
export type User = typeof users.$inferSelect;

// export const insertUserSchema = createInsertSchema(users, {
//     hue: (schema) => schema.id.min(0).max(360),
// });
export type NewUser = typeof users.$inferInsert;

export const authSessions = pgTable("sessions", {
    id: text("id").primaryKey().notNull(),
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
