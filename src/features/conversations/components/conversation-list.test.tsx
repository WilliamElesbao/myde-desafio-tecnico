import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Conversation } from "@/lib/http/api";
import { ConversationList } from "./conversation-list";

const conversations: Conversation[] = [
  {
    id: "c-1",
    contactName: "Mariana Lopes",
    contactPhone: "55",
    avatarColor: "#25D366",
    unread: 0,
    lastMessage: "oi",
    lastMessageAt: new Date().toISOString(),
  },
  {
    id: "c-2",
    contactName: "Rafael Augusto",
    contactPhone: "55",
    avatarColor: "#34B7F1",
    unread: 1,
    lastMessage: "obrigado",
    lastMessageAt: new Date().toISOString(),
  },
];

describe("ConversationList", () => {
  it("renderiza todos os itens", () => {
    render(<ConversationList conversations={conversations} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("marca a conversa ativa", () => {
    render(
      <ConversationList
        conversations={conversations}
        activeConversationId="c-2"
      />,
    );
    expect(
      screen.getByRole("link", { name: /Rafael Augusto/ }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("mostra estado vazio padrão", () => {
    render(<ConversationList conversations={[]} />);
    expect(screen.getByText("Nenhuma conversa")).toBeInTheDocument();
  });

  it("mostra estado vazio de busca quando filtrado", () => {
    render(<ConversationList conversations={[]} isFiltered />);
    expect(screen.getByText("Nenhum resultado")).toBeInTheDocument();
  });
});
