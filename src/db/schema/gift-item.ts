import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { Group } from "../models";
import { users } from "./auth";

export const giftItems = pgTable("gift_items", {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    price: text("price"),
    notes: text("notes"),
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
    link: text("link"),
    purchased: boolean("purchased").default(false).notNull(),
    ideaId: text("idea_link_id"),
    groups: jsonb("groups").$type<Group[]>(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// export const selectGiftItemSchema = createSelectSchema(giftItems);
export type GiftItem = typeof giftItems.$inferSelect;

// export const insertGiftItemSchema = createInsertSchema(giftItems, {
//     id: (schema) => schema.id.uuid(),
//     price: (schema) =>
//         schema.price.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
//             message: "Price must consist of numbers with currency codes.",
//         }),
//     link: (schema) => schema.link.url(),
// }).pick({ id: true });
export type NewGiftItem = typeof giftItems.$inferInsert;

export const ideas = pgTable("ideas", {
    id: text("id").primaryKey().notNull(),
    name: text("name").notNull(),
    price: text("price"),
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
    link: text("link"),
    giftItemId: text("gift_item_id").references(() => giftItems.id, {
        onDelete: "set null",
        onUpdate: "cascade",
    }),
    purchased: boolean("purchased").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// export const selectIdeaSchema = createSelectSchema(ideas);
export type Idea = typeof ideas.$inferSelect;

// export const insertIdeaSchema = createInsertSchema(ideas, {
//     id: (schema) => schema.id.uuid(),
//     price: (schema) =>
//         schema.price.regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
//             message: "Price must consist of numbers with currency codes.",
//         }),
//     link: (schema) => schema.link.url(),
// }).pick({ id: true });
export type NewIdea = typeof ideas.$inferInsert;
