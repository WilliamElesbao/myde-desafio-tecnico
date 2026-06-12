import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/shadcn/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: Readonly<EmptyStateProps>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-8 text-center",
        className,
      )}
    >
      {Icon && <Icon aria-hidden="true" className="size-10 text-neutral-300" />}
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      {description && <p className="text-sm text-neutral-500">{description}</p>}
      {action}
    </div>
  );
}

export { EmptyState };
