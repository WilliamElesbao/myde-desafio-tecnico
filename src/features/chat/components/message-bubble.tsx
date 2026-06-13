import { memo } from "react";
import { cn } from "@/lib/shadcn/utils";
import { formatMessageTime } from "@/utils/format-time";
import type { ChatMessage } from "../types";
import { StatusIcon } from "./status-icon";

const STATUS_LABEL: Record<ChatMessage["status"], string> = {
  sending: "Enviando",
  sent: "Enviada",
  delivered: "Entregue",
  read: "Lida",
  failed: "Falha no envio",
};

type MessageBubbleProps = {
  message: ChatMessage;
};

const MessageBubble = memo(function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isOutgoing = message.direction === "out";

  return (
    <li
      className={cn("flex", isOutgoing ? "justify-end" : "justify-start")}
      aria-label={isOutgoing ? "Mensagem enviada" : "Mensagem recebida"}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 shadow-sm",
          isOutgoing
            ? "rounded-br-none bg-bubble-out"
            : "rounded-bl-none bg-bubble-in",
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word text-sm text-foreground">
          {message.body}
        </p>
        <span className="mt-0.5 flex items-center justify-end gap-1">
          <time
            dateTime={message.createdAt}
            className="text-[11px] text-muted-foreground"
          >
            {formatMessageTime(message.createdAt)}
          </time>
          {isOutgoing && (
            <span title={STATUS_LABEL[message.status]} className="inline-flex">
              <StatusIcon status={message.status} />
              <span className="sr-only">{STATUS_LABEL[message.status]}</span>
            </span>
          )}
        </span>
      </div>
    </li>
  );
});

export { MessageBubble };
