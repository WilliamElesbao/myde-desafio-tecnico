"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MESSAGES_POLL_INTERVAL_MS } from "@/constants/polling";
import { queryKeys } from "@/lib/react-query/query-keys";
import { LATEST_PAGE_CURSOR } from "../constants/pagination";
import { getMessagesPage } from "../services/get-messages-page";
import { flattenMessages } from "../utils/messages-cache";

/**
 * Conversation history with infinite scroll (useInfiniteQuery): the first page
 * brings the most recent messages and `fetchNextPage` loads older ones when
 * scrolling up. Polling refetches loaded pages to receive new messages.
 */
export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.messages(conversationId),
    queryFn: ({ pageParam }) => getMessagesPage(conversationId, pageParam),
    initialPageParam: LATEST_PAGE_CURSOR,
    getNextPageParam: (lastPage) => lastPage.prevCursor ?? undefined,
    select: flattenMessages,
    refetchInterval: MESSAGES_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}
