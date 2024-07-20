import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db, Session, User } from "astro:db";

const adapter = new DrizzleSQLiteAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: import.meta.env.PROD
		}
	}
});

// IMPORTANT!
declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
	}
}