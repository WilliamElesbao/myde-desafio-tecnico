import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@/lib/http/api";
import { cn } from "@/lib/shadcn/utils";
import { formatConversationTime } from "@/utils/format-time";

type ConversationListItemProps = {
  conversation: Conversation;
  isActive?: boolean;
};

function ConversationListItem({
  conversation,
  isActive = false,
}: Readonly<ConversationListItemProps>) {
  const hasUnread = conversation.unread > 0;

  return (
    <li>
      <Link
        href={`/conversations/${conversation.id}`}
        aria-current={isActive ? "page" : undefined}
        aria-label={`Conversa com ${conversation.contactName}${
          hasUnread ? `, ${conversation.unread} mensagens não lidas` : ""
        }`}
        className={cn(
          "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline-none",
          isActive && "bg-surface-hover",
        )}
      >
        <Avatar
          name={conversation.contactName}
          color={conversation.avatarColor}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium text-foreground">
              {conversation.contactName}
            </p>
            <time
              dateTime={conversation.lastMessageAt}
              suppressHydrationWarning
              className={cn(
                "shrink-0 text-xs",
                hasUnread
                  ? "font-semibold text-wa-green-dark"
                  : "text-muted-foreground",
              )}
            >
              {formatConversationTime(conversation.lastMessageAt)}
            </time>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                "truncate text-sm",
                hasUnread
                  ? "font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {conversation.lastMessage}
            </p>
            {hasUnread && (
              <Badge aria-label={`${conversation.unread} não lidas`}>
                {conversation.unread}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export { ConversationListItem };
