import type { ComponentProps } from "react";
import { cn } from "@/lib/shadcn/utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-9 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wa-green-dark disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
