import { cookies } from "next/headers";
import { SPLASH_SEEN_COOKIE } from "@/constants/splash";
import { SplashClient } from "./splash.client";

export async function Splash() {
  const cookieStore = await cookies();
  const seen = cookieStore.get(SPLASH_SEEN_COOKIE)?.value === "true";

  if (seen) return null;

  return <SplashClient />;
}
