import { MessageSquareDashed } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import type { Conversation } from "@/lib/http/api";
import { ConversationListItem } from "./conversation-list-item";

type ConversationListProps = {
  conversations: Conversation[];
  activeConversationId?: string;
  isFiltered?: boolean;
};

function ConversationList({
  conversations,
  activeConversationId,
  isFiltered = false,
}: Readonly<ConversationListProps>) {
  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareDashed}
        title={isFiltered ? "Nenhum resultado" : "Nenhuma conversa"}
        description={
          isFiltered
            ? "Tente buscar por outro nome ou telefone."
            : "Quando um cliente enviar mensagem, ela aparece aqui."
        }
      />
    );
  }

  return (
    <ul aria-label="Lista de conversas" className="divide-y divide-line">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
        />
      ))}
    </ul>
  );
}

export { ConversationList };
