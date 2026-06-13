"use client";

import { WifiOff } from "lucide-react";
import { useConnectionStatus } from "@/contexts/connection-status-context";

function OfflineBanner() {
  const { isOnline } = useConnectionStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 bg-warning-surface px-4 py-1.5 text-xs font-medium text-warning-foreground"
    >
      <WifiOff aria-hidden="true" className="size-3.5" />
      Você está offline — as atualizações serão retomadas quando a conexão
      voltar.
    </div>
  );
}

export { OfflineBanner };
