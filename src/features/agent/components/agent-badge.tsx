"use client";

import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "../hooks/use-me";

function AgentBadge() {
  const { data: me, isPending, isError } = useMe();

  if (isPending) {
    return (
      <div className="flex items-center gap-3 px-4 py-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    );
  }

  if (isError || !me) {
    return (
      <p role="alert" className="px-4 py-3 text-sm text-danger">
        Não foi possível carregar seu perfil.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3 border-b border-line bg-surface-muted px-4 py-3">
      <Avatar name={me.name} className="bg-wa-teal" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {me.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{me.role}</p>
      </div>
    </div>
  );
}

export { AgentBadge };
