import { AlertCircle, Check, CheckCheck, Clock } from "lucide-react";
import { cn } from "@/lib/shadcn/utils";
import type { ChatMessage } from "../types";

function StatusIcon({ status }: Readonly<{ status: ChatMessage["status"] }>) {
  const className = "size-3.5";

  switch (status) {
    case "sending":
      return (
        <Clock
          aria-hidden="true"
          className={cn(className, "text-subtle-foreground")}
        />
      );
    case "sent":
      return (
        <Check
          aria-hidden="true"
          className={cn(className, "text-subtle-foreground")}
        />
      );
    case "delivered":
      return (
        <CheckCheck
          aria-hidden="true"
          className={cn(className, "text-subtle-foreground")}
        />
      );
    case "read":
      return (
        <CheckCheck
          aria-hidden="true"
          className={cn(className, "text-read-tick")}
        />
      );
    case "failed":
      return (
        <AlertCircle
          aria-hidden="true"
          className={cn(className, "text-danger-soft")}
        />
      );
  }
}

export { StatusIcon };
