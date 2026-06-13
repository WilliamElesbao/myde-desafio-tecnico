import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/shadcn/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-1.5 text-xs font-semibold leading-5 min-w-5",
  {
    variants: {
      variant: {
        default: "bg-wa-green text-on-accent",
        secondary: "bg-surface-strong text-secondary-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
