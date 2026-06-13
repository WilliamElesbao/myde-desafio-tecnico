import { cookies } from "next/headers";
import { SplashClient } from "./splash.client";

const COOKIE_NAME = "neofibra_splash_seen";

export async function Splash() {
  const cookieStore = await cookies();
  const seen = cookieStore.get(COOKIE_NAME)?.value === "true";

  if (seen) return null;

  return <SplashClient />;
}
