import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid/non-secure";
import { db } from "./db/index.js";
import { Groups } from "./db/schema/auth.js";
import { giftItems, ideas } from "./db/schema/gift-item.js";
import { verifyPasswordHash } from "./server/password.js";
import {
    createSession,
    deleteSessionTokenCookie,
    generateSessionToken,
    invalidateSession,
    setSessionTokenCookie,
} from "./server/session.js";
import { createUser, getUserFromUsername } from "./server/user.js";

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
            const session = await createSession(
                sessionToken,
                user.id,
                user.groups?.at(0) ?? "BENJAMINS",
            );
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
            const session = await createSession(
                sessionToken,
                user.id,
                user.groups?.at(0) ?? "BENJAMINS",
            );
            setSessionTokenCookie(
                context.cookies,
                sessionToken,
                session.expiresAt,
            );
        },
    }),
    switchGroup: defineAction({
        accept: "form",
        input: z.object({
            group: z.enum(Groups),
        }),
        handler: async ({ group }, context) => {
            const oldSession = context.locals.session;
            if (oldSession === null) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Not authenticated",
                });
            }

            await invalidateSession(oldSession.id);

            const sessionToken = generateSessionToken();
            const session = await createSession(
                sessionToken,
                oldSession.userId,
                group,
            );
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
        },
    }),
};
