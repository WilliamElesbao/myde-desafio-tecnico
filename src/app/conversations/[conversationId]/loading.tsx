/**
 * Intentionally empty, but required: the Suspense boundary it creates makes
 * navigation commit immediately (useParams updates on click) instead of
 * waiting for the server round-trip. Loading feedback lives inside the
 * ChatPanel (parent layout), scoped to the messages area.
 */
export default function ConversationLoading() {
  return null;
}
