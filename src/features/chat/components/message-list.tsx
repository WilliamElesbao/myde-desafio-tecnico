"use client";

import { MessageSquare } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "../types";
import { MessageBubble } from "./message-bubble";

type MessageListProps = {
  messages: ChatMessage[];
  hasOlderMessages: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: () => void;
};

const MessageList = memo(function MessageList({
  messages,
  hasOlderMessages,
  isLoadingOlder,
  onLoadOlder,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages.at(-1)?.id;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll only when the last message changes
  useEffect(() => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [lastMessageId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasOlderMessages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadOlder();
      },
      { root: containerRef.current },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasOlderMessages, onLoadOlder]);

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Nenhuma mensagem ainda"
        description="Envie a primeira mensagem para começar o atendimento."
        className="flex-1"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
    >
      {hasOlderMessages && (
        <div ref={sentinelRef} className="flex justify-center pb-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onLoadOlder()}
            disabled={isLoadingOlder}
          >
            {isLoadingOlder ? "Carregando…" : "Carregar mensagens anteriores"}
          </Button>
        </div>
      )}

      <ul aria-label="Mensagens da conversa" className="space-y-1.5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </ul>
    </div>
  );
});

export { MessageList };
