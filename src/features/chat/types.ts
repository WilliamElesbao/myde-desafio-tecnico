import type { InfiniteData } from "@tanstack/react-query";
import type { Message } from "@/lib/http/api";

/**
 * Message as stored in the client cache: on top of the backend statuses it
 * adds the local optimistic-send states ("sending" before the server
 * confirms, "failed" when the POST fails).
 */
export type ChatMessage = Omit<Message, "status"> & {
  status: Message["status"] | "sending" | "failed";
};

/** History page (infinite scroll). `prevCursor` points to older messages. */
export type MessagesPage = {
  messages: ChatMessage[];
  prevCursor: number | null;
};

export type MessagesInfiniteData = InfiniteData<MessagesPage, number>;
