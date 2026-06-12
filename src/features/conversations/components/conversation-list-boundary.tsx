import type { PropsWithChildren } from "react";
import { ErrorState } from "@/components/error-state";
import { ConversationListSkeleton } from "./conversation-list-skeleton";

type ConversationListBoundaryProps = {
  isPending?: boolean;
  isError?: boolean;
  onRetry?: () => void;
} & PropsWithChildren;

function ConversationListBoundary({
  children,
  isPending,
  isError,
  onRetry,
}: Readonly<ConversationListBoundaryProps>) {
  if (isPending) return <ConversationListSkeleton />;
  if (isError) {
    return <ErrorState title="Erro ao carregar conversas" onRetry={onRetry} />;
  }
  return <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>;
}

export { ConversationListBoundary };
