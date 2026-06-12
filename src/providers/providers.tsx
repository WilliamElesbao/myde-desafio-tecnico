"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { ConnectionStatusProvider } from "@/contexts/connection-status-context";
import { getQueryClient } from "@/lib/react-query/query-client";

export function Providers({ children }: Readonly<PropsWithChildren>) {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      <ConnectionStatusProvider>{children}</ConnectionStatusProvider>
    </QueryClientProvider>
  );
}
