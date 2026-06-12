import { useMutation } from "@tanstack/react-query";
import { suggestReply } from "@/lib/http/api";

export function useAiSuggestion(conversationId: string) {
  return useMutation({
    mutationFn: () => suggestReply(conversationId),
    onMutate: () => {},
    onSuccess: () => {},
  });
}
