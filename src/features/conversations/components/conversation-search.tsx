"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type ConversationSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

function ConversationSearch({
  value,
  onChange,
}: Readonly<ConversationSearchProps>) {
  return (
    <div className="relative px-4 py-2">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-7 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
      />
      <Input
        type="search"
        aria-label="Buscar conversa por nome ou telefone"
        placeholder="Buscar conversa…"
        className="pl-9 text-neutral-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export { ConversationSearch };
