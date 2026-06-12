/**
 * The page intentionally renders nothing and prefetches nothing: the chat
 * panel lives in the parent layout (it must survive [conversationId]
 * changes), so it sits OUTSIDE this segment's Suspense boundary. A server
 * prefetch hydrated here cannot be consumed deterministically by the panel —
 * with streaming, the page chunk may hydrate after the panel renders, which
 * caused recoverable hydration mismatches on refresh (server rendered the
 * message list, client first render showed the skeleton). Messages are
 * fetched client-side by useMessages (React Query cache + polling).
 */
export default function ConversationPage() {
  return null;
}
