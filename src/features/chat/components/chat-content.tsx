import type { UseInfiniteQueryResult } from "@tanstack/react-query";
import { ErrorState } from "@/components/error-state";
import type { ChatMessage } from "../types";
import { ChatSkeleton } from "./chat-skeleton";
import { MessageList } from "./message-list";

type ChatContentProps = {
  messages: UseInfiniteQueryResult<ChatMessage[], Error>;
};

function ChatContent({ messages }: Readonly<ChatContentProps>) {
  if (messages.isPending) return <ChatSkeleton />;

  if (messages.isError) {
    return (
      <ErrorState
        title="Erro ao carregar mensagens"
        onRetry={messages.refetch}
        className="flex-1"
      />
    );
  }

  return (
    <MessageList
      messages={messages.data}
      hasOlderMessages={messages.hasNextPage}
      isLoadingOlder={messages.isFetchingNextPage}
      onLoadOlder={messages.fetchNextPage}
    />
  );
}

export { ChatContent };
