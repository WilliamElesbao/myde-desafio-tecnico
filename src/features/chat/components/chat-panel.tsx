"use client";

import { SearchX } from "lucide-react";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { useConversation } from "@/features/conversations/hooks/use-conversation";
import { useMessages } from "../hooks/use-messages";
import { ChatContent } from "./chat-content";
import { ChatHeader } from "./chat-header";
import { MessageComposer } from "./message-composer";

function ChatPanel() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const conversation = useConversation(conversationId);
  const messages = useMessages(conversationId);

  if (conversation.isSuccess && !conversation.data) {
    return (
      <EmptyState
        icon={SearchX}
        title="Conversa não encontrada"
        description="Ela pode ter sido removida. Volte para a lista e tente novamente."
        className="flex-1"
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader conversation={conversation.data} />

      <ChatContent messages={messages} />

      <MessageComposer conversationId={conversationId} />
    </div>
  );
}

export { ChatPanel };
