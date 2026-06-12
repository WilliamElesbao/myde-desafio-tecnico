"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { SEARCH_DEBOUNCE_MS } from "@/constants/polling";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useConversations } from "../hooks/use-conversations";
import { filterConversations } from "../utils/filter-conversations";
import { ConversationList } from "./conversation-list";
import { ConversationListBoundary } from "./conversation-list-boundary";
import { ConversationSearch } from "./conversation-search";

function ConversationsPanel() {
  const params = useParams<{ conversationId?: string }>();
  const activeConversationId = params?.conversationId;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const {
    data: conversations,
    isPending,
    isError,
    refetch,
  } = useConversations();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ConversationSearch value={search} onChange={setSearch} />

      <ConversationListBoundary
        isPending={isPending}
        isError={isError}
        onRetry={refetch}
      >
        <ConversationList
          conversations={filterConversations(
            conversations ?? [],
            debouncedSearch,
          )}
          activeConversationId={activeConversationId}
          isFiltered={debouncedSearch.trim().length > 0}
        />
      </ConversationListBoundary>
    </div>
  );
}

export { ConversationsPanel };
