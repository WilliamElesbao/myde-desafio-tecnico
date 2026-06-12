export const queryKeys = {
  me: () => ["me"] as const,
  conversations: () => ["conversations"] as const,
  conversation: (id: string) => ["conversations", id] as const,
};
