import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/shadcn/utils";

const BUBBLES: Array<{ side: "in" | "out"; width: string }> = [
  { side: "in", width: "w-48" },
  { side: "in", width: "w-64" },
  { side: "out", width: "w-56" },
  { side: "in", width: "w-40" },
  { side: "out", width: "w-72" },
];

function ChatSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Carregando mensagens"
      className="flex flex-1 flex-col gap-3 px-4 py-4"
    >
      {BUBBLES.map((bubble, index) => (
        <div
          key={`chat-skeleton-${
            // biome-ignore lint/suspicious/noArrayIndexKey: Safe here because BUBBLES is a static skeleton layout with a fixed order and no dynamic updates.
            index
          }`}
          className={cn(
            "flex",
            bubble.side === "out" ? "justify-end" : "justify-start",
          )}
        >
          <Skeleton className={cn("h-12 rounded-lg", bubble.width)} />
        </div>
      ))}
    </div>
  );
}

export { ChatSkeleton };
