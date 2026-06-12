"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Conversation, sendMessage } from "@/lib/http/api";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { MessagesInfiniteData } from "../types";
import { buildOptimisticMessage } from "../utils/build-optimistic-message";
import {
  appendMessage,
  removeMessage,
  replaceMessage,
} from "../utils/messages-cache";

type SendMessageContext = {
  messagesKey: ReturnType<typeof queryKeys.messages>;
  optimisticId: string;
};

/**
 * Send with optimistic update via onMutate: the message enters the cache
 * (and the sidebar shows it as last message) before the server responds.
 *
 * On error only this send's optimistic message is removed (rollback by id,
 * not by snapshot — snapshots would wipe optimistic messages of concurrent
 * sends); the sidebar corrects itself through the onSettled invalidation.
 * On success the optimistic message is replaced by the confirmed one.
 */
export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const conversationsKey = queryKeys.conversations();

  return useMutation({
    mutationFn: (text: string) => sendMessage(conversationId, text),

    onMutate: async (text): Promise<SendMessageContext> => {
      const messagesKey = queryKeys.messages(conversationId);

      // Prevents an in-flight poll from overwriting the optimistic update
      await Promise.all([
        queryClient.cancelQueries({ queryKey: messagesKey }),
        queryClient.cancelQueries({ queryKey: conversationsKey }),
      ]);

      const optimisticMessage = buildOptimisticMessage(text);

      queryClient.setQueryData<MessagesInfiniteData>(messagesKey, (old) =>
        appendMessage(old, optimisticMessage),
      );

      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
        old?.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                lastMessage: text,
                lastMessageAt: optimisticMessage.createdAt,
              }
            : conversation,
        ),
      );

      return { messagesKey, optimisticId: optimisticMessage.id };
    },

    onError: (_error, _text, context) => {
      if (!context) return;
      queryClient.setQueryData<MessagesInfiniteData>(
        context.messagesKey,
        (old) => removeMessage(old, context.optimisticId),
      );
    },

    onSuccess: (savedMessage, _text, context) => {
      queryClient.setQueryData<MessagesInfiniteData>(
        context.messagesKey,
        (old) => replaceMessage(old, context.optimisticId, savedMessage),
      );
    },

    onSettled: (_data, _error, _text, context) => {
      if (context) {
        queryClient.invalidateQueries({ queryKey: context.messagesKey });
      }
      queryClient.invalidateQueries({ queryKey: conversationsKey });
    },
  });
}
