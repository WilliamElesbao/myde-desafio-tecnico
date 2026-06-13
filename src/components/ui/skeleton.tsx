import type { ComponentProps } from "react";
import { cn } from "@/lib/shadcn/utils";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-skeleton", className)}
      {...props}
    />
  );
}

export { Skeleton };
