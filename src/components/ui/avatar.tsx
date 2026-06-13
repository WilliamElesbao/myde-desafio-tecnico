import type { ComponentProps } from "react";
import { cn } from "@/lib/shadcn/utils";
import { getInitials } from "@/utils/get-initials";

type AvatarProps = ComponentProps<"span"> & {
  name: string;
  color?: string;
};

function Avatar({ name, color, className, ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      aria-hidden="true"
      className={cn(
        "flex size-10 shrink-0 select-none items-center justify-center rounded-full bg-avatar-fallback text-sm font-semibold text-on-accent",
        className,
      )}
      style={color ? { backgroundColor: color } : undefined}
      {...props}
    >
      {getInitials(name)}
    </span>
  );
}

export { Avatar };
