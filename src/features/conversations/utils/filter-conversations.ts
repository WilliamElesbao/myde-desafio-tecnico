import type { Conversation } from "@/lib/api";

/** Search by name or phone number, ignoring accents/case */
export function filterConversations(
  conversations: Conversation[],
  search: string,
): Conversation[] {
  const term = normalize(search);
  if (!term) return conversations;

  const digits = term.replace(/\D/g, "");

  return conversations.filter(
    (conversation) =>
      normalize(conversation.contactName).includes(term) ||
      (digits.length > 0 && conversation.contactPhone.includes(digits)),
  );
}

function normalize(value: string): string {
  return value.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
