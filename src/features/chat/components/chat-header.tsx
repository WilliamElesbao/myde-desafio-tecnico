import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation } from "@/lib/http/api";

type ChatHeaderProps = {
  conversation?: Conversation;
};

function ChatHeader({ conversation }: Readonly<ChatHeaderProps>) {
  return (
    <header className="flex items-center gap-3 border-b border-line bg-surface-muted px-4 py-2.5">
      <Link
        href="/"
        aria-label="Voltar para a lista de conversas"
        className="rounded-md p-1.5 text-secondary-foreground hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wa-green-dark md:hidden"
      >
        <ArrowLeft aria-hidden="true" className="size-5" />
      </Link>

      {conversation ? (
        <>
          <Avatar
            name={conversation.contactName}
            color={conversation.avatarColor}
            className="size-9"
          />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-foreground">
              {conversation.contactName}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              +{conversation.contactPhone}
            </p>
          </div>
        </>
      ) : (
        <div aria-hidden="true" className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      )}
    </header>
  );
}

export { ChatHeader };
