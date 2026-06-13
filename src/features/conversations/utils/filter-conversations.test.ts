import { describe, expect, it } from "vitest";
import type { Conversation } from "@/lib/http/api";
import { filterConversations } from "./filter-conversations";

const conversations: Conversation[] = [
  {
    id: "c-1",
    contactName: "Mariana Lopes",
    contactPhone: "5511988887766",
    avatarColor: "#25D366",
    unread: 2,
    lastMessage: "Minha internet caiu",
    lastMessageAt: "2026-06-11T11:42:00.000Z",
  },
  {
    id: "c-2",
    contactName: "João Pádua",
    contactPhone: "5511977776655",
    avatarColor: "#34B7F1",
    unread: 0,
    lastMessage: "Obrigado!",
    lastMessageAt: "2026-06-11T10:15:00.000Z",
  },
];

describe("filterConversations", () => {
  it("retorna tudo quando a busca é vazia", () => {
    expect(filterConversations(conversations, "")).toHaveLength(2);
    expect(filterConversations(conversations, "   ")).toHaveLength(2);
  });

  it("filtra por nome ignorando maiúsculas", () => {
    const result = filterConversations(conversations, "mariana");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c-1");
  });

  it("filtra ignorando acentos", () => {
    const result = filterConversations(conversations, "joao padua");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c-2");
  });

  it("filtra por telefone", () => {
    const result = filterConversations(conversations, "988887766");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("c-1");
  });

  it("retorna vazio quando nada casa", () => {
    expect(filterConversations(conversations, "inexistente")).toHaveLength(0);
  });
});
