import {
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const Groups = ["BENJAMINS", "HAUGEN"] as const;
export type Group = (typeof Groups)[number];

// export const UserSizesSchema = z.object({
// 	simple: z.object({
// 		top: z.string().optional(),
// 		bottom: z.string().optional(),
// 		shoe: z.string().optional(),
// 	}),
// 	advanced: z.object({
// 		head: z.string().optional(),
// 		sleeve: z.string().optional(),
// 		chest: z.string().optional(),
// 		waist: z.string().optional(),
// 		hip: z.string().optional(),
// 		inseam: z.string().optional(),
// 	}),
// });
// export type UserSizes = z.infer<typeof UserSizesSchema>;

export const users = pgTable("users", {
    id: text("id").primaryKey().notNull(),
    name: text("name").unique(),
    username: text("user_name").notNull().unique(),
    partnerId: text("partner_id"),
    groups: jsonb("groups").$type<Group[]>(),
    hue: integer("hue").default(145).notNull(),
    // sizes: jsonb("sizes").$type<UserSizes>(),
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
    group: text("group").$type<Group>(),
});

export type AuthSession = typeof authSessions.$inferSelect;
