import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { verifyPasswordHash } from "@lib/server/password";
import {
    createSession,
    deleteSessionTokenCookie,
    generateSessionToken,
    invalidateSession,
    setSessionTokenCookie,
} from "@lib/server/session";
import { createUser, getUserFromUsername } from "@lib/server/user";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { Groups } from "./db/schema/auth";
import { giftItems, ideas } from "./db/schema/gift-item";

export const server = {
    login: defineAction({
        accept: "form",
        input: z.object({
            username: z.string().min(1),
            password: z.string().min(4).max(255),
        }),
        handler: async ({ username, password }, context) => {
            const user = await getUserFromUsername(username);
            if (user === null) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Account does not exist",
                });
            }

            const validPassword = await verifyPasswordHash(
                user.hashedPassword,
                password,
            );
            if (!validPassword) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Invalid password",
                });
            }

            const sessionToken = generateSessionToken();
            const session = await createSession(sessionToken, user.id);
            setSessionTokenCookie(
                context.cookies,
                sessionToken,
                session.expiresAt,
            );
        },
    }),
    logout: defineAction({
        accept: "form",
        handler: async (_input, context) => {
            if (context.locals.session === null) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Not authenticated",
                });
            }

            invalidateSession(context.locals.session.id);
            deleteSessionTokenCookie(context.cookies);
        },
    }),
    signup: defineAction({
        accept: "form",
        input: z.object({
            username: z.string().min(3),
            password: z.string().min(4).max(255),
        }),
        handler: async ({ username, password }, context) => {
            const user = await createUser(username, password);

            const sessionToken = generateSessionToken();
            const session = await createSession(sessionToken, user.id);
            setSessionTokenCookie(
                context.cookies,
                sessionToken,
                session.expiresAt,
            );
        },
    }),

    togglePurchased: defineAction({
        accept: "form",
        input: z.object({
            id: z.string(),
            type: z.enum(["IDEA", "GIFT"]),
            purchased: z.boolean(),
        }),
        handler: async ({ id, type, purchased }) => {
            if (type === "GIFT") {
                await db
                    .update(giftItems)
                    .set({
                        purchased,
                    })
                    .where(eq(giftItems.id, id));
            } else {
                await db
                    .update(ideas)
                    .set({
                        purchased,
                    })
                    .where(eq(ideas.id, id));
            }

            return purchased;
        },
    }),

    newWishList: defineAction({
        accept: "form",
        input: z.object({
            name: z.string(),
            price: z
                .string()
                .regex(/(?:[$€])?\s?\d+(?:[,.]\d+)?/g, {
                    message:
                        "Price must consist of numbers with currency codes.",
                })
                .nullish(),
            notes: z.string().nullish(),
            link: z.string().url().nullish(),
            groups: z.enum(Groups).array().optional(),
        }),
        handler: async ({ name, price, notes, link, groups }, context) => {
            if (!context.locals.user) return;

            const userGroup = context.locals.user.groups?.at(0);

            await db.insert(giftItems).values({
                id: crypto.randomUUID(),
                name,
                price,
                recipientId: context.locals.user.id,
                notes,
                link,
                groups: groups ? groups : userGroup ? [userGroup] : [],
            });
        },
    }),
};
