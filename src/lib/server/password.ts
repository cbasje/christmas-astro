import { hash, verify } from "@node-rs/argon2";

export async function hashPassword(password: string): Promise<string> {
    return await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
}

export async function verifyPasswordHash(
    hash: string | null,
    password: string,
): Promise<boolean> {
    if (hash === null) return false;
    return await verify(hash, password);
}
