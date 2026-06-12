"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { ConnectionStatusProvider } from "@/contexts/connection-status-context";

export function Providers({ children }: Readonly<PropsWithChildren>) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <ConnectionStatusProvider>{children}</ConnectionStatusProvider>
    </QueryClientProvider>
  );
}
