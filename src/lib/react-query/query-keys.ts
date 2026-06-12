export const QUERY_KEY = {
  ME: "me",
  CONVERSATIONS: "conversations",
  MESSAGES: "messages",
  AI_SUGGESTION: "ai-suggestion",
} as const;

export const queryKeys = {
  me: () => [QUERY_KEY.ME] as const,
  conversations: () => [QUERY_KEY.CONVERSATIONS] as const,
  messages: (conversationId: string) =>
    [QUERY_KEY.MESSAGES, conversationId] as const,
};
