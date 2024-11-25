import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { verifyPasswordHash } from "./server/password";
import {
	createSession,
	deleteSessionTokenCookie,
	generateSessionToken,
	invalidateSession,
	setSessionTokenCookie,
} from "./server/session";
import { createUser, getUserFromUsername } from "./server/user";

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

			const validPassword = await verifyPasswordHash(user.hashedPassword, password);
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
				user.groups?.at(0) ?? "BENJAMINS"
			);
			setSessionTokenCookie(context, sessionToken, session.expiresAt);
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
			deleteSessionTokenCookie(context);
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
				user.groups?.at(0) ?? "BENJAMINS"
			);
			setSessionTokenCookie(context, sessionToken, session.expiresAt);
		},
	}),
};
