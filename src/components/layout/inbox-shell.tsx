"use client";

import { useParams } from "next/navigation";
import type { PropsWithChildren, ReactNode } from "react";
import { OfflineBanner } from "@/components/offline-banner";
import { cn } from "@/lib/shadcn/utils";

type InboxShellProps = {
  sidebar: ReactNode;
} & PropsWithChildren;

function InboxShell({ sidebar, children }: InboxShellProps) {
  const params = useParams<{ conversationId?: string }>();
  const isChatOpen = Boolean(params?.conversationId);

  return (
    <div className="flex h-dvh flex-col">
      <OfflineBanner />
      <div className="flex min-h-0 flex-1">
        <aside
          aria-label="Conversas"
          className={cn(
            "min-h-0 w-full flex-col overflow-hidden border-neutral-200 bg-sidebar-bg md:flex md:w-96 md:shrink-0 md:border-r",
            isChatOpen ? "hidden" : "flex",
          )}
        >
          {sidebar}
        </aside>
        <main
          className={cn(
            "min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-chat-bg md:flex",
            isChatOpen ? "flex" : "hidden",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export { InboxShell };
