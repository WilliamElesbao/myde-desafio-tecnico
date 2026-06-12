import { OPTIMISTIC_MESSAGE_ID_PREFIX } from "../constants/pagination";
import type { ChatMessage } from "../types";

export function buildOptimisticMessage(text: string): ChatMessage {
  const uniqueId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return {
    id: `${OPTIMISTIC_MESSAGE_ID_PREFIX}${uniqueId}`,
    direction: "out",
    body: text,
    status: "sending",
    createdAt: new Date().toISOString(),
  };
}
