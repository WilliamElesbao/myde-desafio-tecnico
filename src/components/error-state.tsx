"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shadcn/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar os dados. Verifique sua conexão.",
  onRetry,
  className,
}: Readonly<ErrorStateProps>) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-8 text-center",
        className,
      )}
    >
      <AlertTriangle aria-hidden="true" className="size-10 text-red-400" />
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      <p className="text-sm text-neutral-500">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
