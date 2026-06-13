"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "neofibra_splash_seen";

export async function markSplashSeenAction() {
  (await cookies()).set(COOKIE_NAME, "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}