import { eq } from "drizzle-orm";
import { nanoid } from "nanoid/non-secure";
import { db } from "../db";
import { type User, users } from "../db/schema/auth";
import { capitaliseString } from "../lib/utils";
import { hashPassword } from "./password";

export function verifyUsernameInput(username: string): boolean {
    return (
        username.length > 3 &&
        username.length < 32 &&
        username.trim() === username
    );
}

export async function createUser(
    username: string,
    password: string,
): Promise<User> {
    const hashedPassword = await hashPassword(password);
    const [row] = await db
        .insert(users)
        .values({
            id: nanoid(),
            username: username.toLowerCase(),
            hashedPassword,
            name: capitaliseString(username),
            partnerId: null,
            groups: ["HAUGEN", "BENJAMINS"],
            // sizes: { simple: {}, advanced: {} },
            hue: 145,
            updatedAt: new Date(),
        })
        .returning();

    if (!row) {
        throw new Error("Unexpected error");
    }
    return row;
}

export async function updateUserPassword(
    userId: string,
    password: string,
): Promise<void> {
    const hashedPassword = await hashPassword(password);
    await db.update(users).set({ hashedPassword }).where(eq(users.id, userId));
}

export async function getUserPasswordHash(userId: string): Promise<string> {
    const [row] = await db
        .select({ hashedPassword: users.hashedPassword })
        .from(users)
        .where(eq(users.id, userId));
    if (!row || row.hashedPassword === null) {
        throw new Error("Invalid user ID");
    }
    return row.hashedPassword;
}

export async function getUserFromUsername(
    username: string,
): Promise<User | null> {
    const [row] = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
    if (!row) {
        return null;
    }
    return row;
}
