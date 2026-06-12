"use client";

import { useQuery } from "@tanstack/react-query";
import { CONVERSATIONS_POLL_INTERVAL_MS } from "@/constants/polling";
import { type Conversation, getConversations } from "@/lib/http/api";
import { queryKeys } from "@/lib/react-query/query-keys";

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.conversations(),
    queryFn: getConversations,
    refetchInterval: CONVERSATIONS_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    select: (conversations: Conversation[]) =>
      conversations.find((conversation) => conversation.id === conversationId),
  });
}
