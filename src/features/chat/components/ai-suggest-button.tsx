"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAiSuggestion } from "../hooks/use-ai-suggestion";

type AiSuggestButtonProps = {
  conversationId: string;
};

function AiSuggestButton({ conversationId }: Readonly<AiSuggestButtonProps>) {
  const suggestion = useAiSuggestion(conversationId);

  const { reset: resetSuggestion } = suggestion;
  useEffect(() => {
    resetSuggestion();
  }, [resetSuggestion]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => suggestion.mutate()}
        disabled={suggestion.isPending}
        aria-label="Sugerir resposta com IA"
      >
        {suggestion.isPending ? (
          <Loader2 aria-hidden="true" className="animate-spin" />
        ) : (
          <Sparkles aria-hidden="true" className="text-wa-green-dark" />
        )}
        {suggestion.isPending ? "Gerando…" : "Sugerir resposta com IA"}
      </Button>
      <span aria-live="polite" className="text-xs text-red-600">
        {suggestion.isError ? "Não foi possível gerar a sugestão." : ""}
      </span>
    </div>
  );
}

export { AiSuggestButton };
