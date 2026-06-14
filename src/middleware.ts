import { NextResponse } from "next/server";

/**
 * Short-circuits requests to the e2e mock API prefix so they never render an
 * app page.
 *
 * In e2e, NEXT_PUBLIC_API_URL is same-origin (the browser side is mocked with
 * page.route). The root layout's server-side prefetch, however, runs in Node
 * and requests `/e2e-api/*` from the server itself — an unknown path that would
 * render not-found wrapped by the root layout, which prefetches again →
 * infinite recursion (OOM). Returning 404 here stops that before any render.
 *
 * Production never hits this path (the real API is a different host), so this
 * matcher-scoped middleware is a no-op there.
 */
export function middleware() {
  return new NextResponse(null, { status: 404 });
}

export const config = {
  matcher: "/e2e-api/:path*",
};
