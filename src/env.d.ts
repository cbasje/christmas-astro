/// <reference path="../.astro/types.d.ts" />
declare namespace App {
    interface Locals {
        user: import("./db/schema/auth").User | null;
        session: import("./db/schema/auth").AuthSession | null;
    }
}
