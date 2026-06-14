"use server";

import { cookies } from "next/headers";
import { SPLASH_SEEN_COOKIE, SPLASH_SEEN_MAX_AGE_S } from "@/constants/splash";

/**
 * Persists, on the server, that the first-visit splash has played — so the
 * next load is rendered without it. Called by the client splash when it fades.
 */
export async function markSplashSeenAction() {
  (await cookies()).set(SPLASH_SEEN_COOKIE, "true", {
    path: "/",
    maxAge: SPLASH_SEEN_MAX_AGE_S,
    sameSite: "lax",
  });
}
