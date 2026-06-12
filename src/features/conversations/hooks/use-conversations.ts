"use client";

import { useQuery } from "@tanstack/react-query";
import { CONVERSATIONS_POLL_INTERVAL_MS } from "@/constants/polling";
import { getConversations } from "@/lib/api";
import { queryKeys } from "@/lib/react-query/query-keys";

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations(),
    queryFn: getConversations,
    refetchInterval: CONVERSATIONS_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}
