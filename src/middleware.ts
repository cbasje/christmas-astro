import { defineMiddleware } from "astro:middleware";
import {
    deleteSessionTokenCookie,
    setSessionTokenCookie,
    validateSessionToken,
} from "./server/session";

export const onRequest = defineMiddleware(async (context, next) => {
    const token = context.cookies.get("session")?.value ?? null;
    if (token === null) {
        context.locals.session = null;
        context.locals.user = null;
        return next();
    }

    const { user, session } = await validateSessionToken(token);
    if (session !== null) {
        setSessionTokenCookie(context.cookies, token, session.expiresAt);
    } else {
        deleteSessionTokenCookie(context.cookies);
    }

    context.locals.session = session;
    context.locals.user = user;
    return next();
});
