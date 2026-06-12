import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/lib/http/api";

export function useSendMessage(conversationId: string) {
  return useMutation({
    mutationFn: (text: string) => sendMessage(conversationId, text),
    onMutate: async () => {},
    onError: () => {},
    onSuccess: () => {},
    onSettled: () => {},
  });
}
