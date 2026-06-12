import { getMessages } from "@/lib/http/api";
import {
  LATEST_PAGE_CURSOR,
  MESSAGES_PAGE_SIZE,
} from "../constants/pagination";
import type { MessagesPage } from "../types";

/**
 * The API does not paginate (it returns the full history), so the slicing
 * into pages happens here, from the end (newest) towards the start (oldest),
 * using the absolute index in the array as cursor. This keeps the
 * `useInfiniteQuery` contract and would be transparent if the backend ever
 * accepted `?cursor=&limit=`.
 *
 * `cursor === LATEST_PAGE_CURSOR` (0) means "latest page"; cursors of older
 * pages are always > 0 (start index of the next slice).
 */
export async function getMessagesPage(
  conversationId: string,
  cursor: number,
  pageSize: number = MESSAGES_PAGE_SIZE,
): Promise<MessagesPage> {
  const allMessages = await getMessages(conversationId);

  const end =
    cursor === LATEST_PAGE_CURSOR
      ? allMessages.length
      : Math.min(cursor, allMessages.length);
  const start = Math.max(0, end - pageSize);

  return {
    messages: allMessages.slice(start, end),
    prevCursor: start > 0 ? start : null,
  };
}
