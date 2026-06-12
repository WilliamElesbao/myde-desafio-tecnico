import type { Metadata } from "next";
import "../styles/globals.css";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { InboxShell } from "@/components/layout/inbox-shell";
import { AgentBadge } from "@/features/agent/components/agent-badge";
import { ConversationsPanel } from "@/features/conversations/components/conversations-panel";
import { getConversations, getMe } from "@/lib/http/api";
import { makeQueryClient } from "@/lib/react-query/query-client";
import { queryKeys } from "@/lib/react-query/query-keys";
import { Providers } from "../providers/providers";

export const metadata: Metadata = {
  title: "Inbox de Atendimento — Desafio Frontend",
  description: "Desafio técnico frontend Myde",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const queryClient = makeQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.conversations(),
      queryFn: getConversations,
    }),
    queryClient.prefetchQuery({ queryKey: queryKeys.me(), queryFn: getMe }),
  ]);

  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <InboxShell
              sidebar={
                <>
                  <AgentBadge />
                  <ConversationsPanel />
                </>
              }
            >
              {children}
            </InboxShell>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
