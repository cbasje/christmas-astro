import { sha256 } from "@oslojs/crypto/sha2";
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase,
} from "@oslojs/encoding";
import type { AstroCookies } from "astro";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import {
    type AuthSession,
    type User,
    authSessions,
    users,
} from "../../db/schema/auth";

export async function validateSessionToken(
    token: string,
): Promise<
    { session: AuthSession; user: User } | { session: null; user: null }
> {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
    );
    const [row] = await db
        .select()
        .from(authSessions)
        .innerJoin(users, eq(authSessions.userId, users.id))
        .where(eq(authSessions.id, sessionId))
        .limit(1);

    if (!row) {
        return { session: null, user: null };
    }

    if (Date.now() >= row.sessions.expiresAt.getTime()) {
        await db
            .delete(authSessions)
            .where(eq(authSessions.id, row.sessions.id));
        return { session: null, user: null };
    }
    if (
        Date.now() >=
        row.sessions.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15
    ) {
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db
            .update(authSessions)
            .set({
                expiresAt: expiresAt,
            })
            .where(eq(authSessions.id, row.sessions.id));
    }
    return { session: row.sessions, user: row.users };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(authSessions).where(eq(authSessions.id, sessionId));
}

export async function invalidateUserSessions(userId: string): Promise<void> {
    await db.delete(authSessions).where(eq(authSessions.userId, userId));
}

export function setSessionTokenCookie(
    cookies: AstroCookies,
    token: string,
    expiresAt: Date,
): void {
    cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        expires: expiresAt,
    });
}

export function deleteSessionTokenCookie(cookies: AstroCookies): void {
    cookies.set("session", "", {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 0,
    });
}

export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
    return token;
}

export async function createSession(
    token: string,
    userId: string,
): Promise<AuthSession> {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token)),
    );
    const [session] = await db
        .insert(authSessions)
        .values({
            id: sessionId,
            userId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        })
        .returning();
    return session;
}
