import { MessageSquareText } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function InboxPage() {
  return (
    <EmptyState
      icon={MessageSquareText}
      title="Selecione uma conversa"
      description="Escolha uma conversa na lista para começar o atendimento."
      className="flex-1"
    />
  );
}
