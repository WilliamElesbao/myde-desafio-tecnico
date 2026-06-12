import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/react-query/query-client";

export default async function ConversationPage() {
  const queryClient = makeQueryClient();

  return <HydrationBoundary state={dehydrate(queryClient)} />;
}
