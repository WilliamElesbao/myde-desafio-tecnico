"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

type GlobalErrorProps = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: Readonly<GlobalErrorProps>) {
  useEffect(() => {
    // In production, send to observability (Sentry etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-dvh items-center justify-center">
      <ErrorState
        title="Algo deu errado no inbox"
        description="Um erro inesperado aconteceu. Tente recarregar."
        onRetry={reset}
      />
    </div>
  );
}
