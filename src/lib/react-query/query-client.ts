import { environmentManager, QueryClient } from "@tanstack/react-query";
import { QUERY_STALE_TIME_MS } from "@/constants/polling";

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avoids an immediate client refetch right after SSR prefetch hydration
        staleTime: QUERY_STALE_TIME_MS,
        retry: 1,
        refetchOnWindowFocus: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * On the server every request gets a fresh QueryClient (prevents cache
 * leaking between users). In the browser a singleton preserves the cache
 * across renders and suspensions.
 */
export function getQueryClient(): QueryClient {
  if (environmentManager.isServer()) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
