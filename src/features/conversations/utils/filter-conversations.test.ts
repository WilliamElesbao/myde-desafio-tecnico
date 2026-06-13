import { describe, expect, it } from "vitest";
import type { Conversation } from "@/lib/http/api";
import { conversations as mockConversations } from "../../../../e2e/support/mock-api";
import { filterConversations } from "./filter-conversations";

const conversations: Conversation[] = [
  ...mockConversations,
  {
    id: "c-1003",
    contactName: "João Pádua",
    contactPhone: "5511987654321",
    avatarColor: "#FF87",
    unread: 0,
    lastMessage: "Obrigado!",
    lastMessageAt: "2026-06-11T10:15:00.000Z",
  },
];

describe("filterConversations", () => {
  it("retorna tudo quando a busca é vazia", () => {
    expect(filterConversations(conversations, "")).toHaveLength(3);
    expect(filterConversations(conversations, "   ")).toHaveLength(3);
  });

  it("filtra por nome ignorando maiúsculas", () => {
    const result = filterConversations(conversations, "mariana");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c-1001");
  });

  it("filtra ignorando acentos", () => {
    const result = filterConversations(conversations, "joao padua");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c-1003");
  });

  it("filtra por telefone", () => {
    const result = filterConversations(conversations, "988887766");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c-1001");
  });

  it("retorna vazio quando nada casa", () => {
    expect(filterConversations(conversations, "inexistente")).toHaveLength(0);
  });
});
