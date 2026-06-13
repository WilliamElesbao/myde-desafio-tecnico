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
      <a
        href="#conteudo-principal"
        className="sr-only rounded-md bg-wa-green-dark px-4 py-2 text-on-accent focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wa-teal"
      >
        Pular para o conteúdo
      </a>
      <OfflineBanner />
      <div className="flex min-h-0 flex-1">
        <aside
          aria-label="Conversas"
          className={cn(
            "min-h-0 w-full flex-col overflow-hidden border-line bg-sidebar-bg md:flex md:w-96 md:shrink-0 md:border-r",
            isChatOpen ? "hidden" : "flex",
          )}
        >
          {sidebar}
        </aside>
        <main
          id="conteudo-principal"
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
