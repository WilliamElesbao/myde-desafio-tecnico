"use client";

import { useMutation } from "@tanstack/react-query";
import { suggestReply } from "@/lib/http/api";

type UseAiSuggestionOptions = {
  onSuggestion: (suggestion: string) => void;
};

/**
 * Asks the backend for a reply suggestion (it proxies OpenAI — the key never
 * reaches the browser) and delivers the text through the callback.
 *
 * The composer stays mounted when switching conversations, so a response
 * that arrives late must not fill another conversation's draft: the id is
 * captured in onMutate and checked against the current one before calling
 * the callback.
 */
export function useAiSuggestion(
  conversationId: string,
  { onSuggestion }: UseAiSuggestionOptions,
) {
  return useMutation({
    mutationFn: () => suggestReply(conversationId),
    onMutate: () => ({ requestedConversationId: conversationId }),
    onSuccess: (data, _variables, context) => {
      if (context.requestedConversationId !== conversationId) return;
      if (data.suggestion) onSuggestion(data.suggestion);
    },
  });
}
