import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ITEMS = 6;

function ConversationListSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Carregando conversas"
    >
      {Array.from({ length: SKELETON_ITEMS }, (_, index) => (
        <div
          key={`conversation-skeleton-${
            // biome-ignore lint/suspicious/noArrayIndexKey: Safe for skeleton placeholders because the list is static and never reordered.
            index
          }`}
          className="flex items-center gap-3 px-4 py-3"
        >
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { ConversationListSkeleton };
