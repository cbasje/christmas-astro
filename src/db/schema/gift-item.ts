import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { type Group, users } from "./auth";

export const giftItems = pgTable("gift_items", {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    price: text(),
    notes: text(),
    recipientId: text("recipient_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "restrict",
            onUpdate: "cascade",
        }),
    giftedById: text("gifted_by_id").references(() => users.id, {
        onDelete: "set null",
        onUpdate: "cascade",
    }),
    link: text(),
    purchased: boolean().default(false).notNull(),
    ideaId: text("idea_link_id"),
    groups: jsonb().$type<Group[]>(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type GiftItem = typeof giftItems.$inferSelect;
export type NewGiftItem = typeof giftItems.$inferInsert;

export const ideas = pgTable("ideas", {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    price: text(),
    recipientId: text("recipient_id")
        .notNull()
        .references(() => users.id, {
            onDelete: "restrict",
            onUpdate: "cascade",
        }),
    giftedById: text("gifted_by_id").references(() => users.id, {
        onDelete: "set null",
        onUpdate: "cascade",
    }),
    link: text(),
    giftItemId: text("gift_item_id").references(() => giftItems.id, {
        onDelete: "set null",
        onUpdate: "cascade",
    }),
    purchased: boolean().default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;
