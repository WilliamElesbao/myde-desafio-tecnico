import type { PropsWithChildren } from "react";
import { ChatPanel } from "@/features/chat/components/chat-panel";

export default function ConversationsLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      {children}
      <ChatPanel />
    </>
  );
}
