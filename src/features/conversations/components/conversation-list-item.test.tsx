import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Conversation } from "@/lib/http/api";
import { ConversationListItem } from "./conversation-list-item";

const conversation: Conversation = {
  id: "c-1",
  contactName: "Mariana Lopes",
  contactPhone: "5511988887766",
  avatarColor: "#25D366",
  unread: 2,
  lastMessage: "Minha internet caiu de novo",
  lastMessageAt: new Date().toISOString(),
};

function renderItem(override: Partial<Conversation> = {}, isActive = false) {
  return render(
    <ul>
      <ConversationListItem
        conversation={{ ...conversation, ...override }}
        isActive={isActive}
      />
    </ul>,
  );
}

describe("ConversationListItem", () => {
  it("mostra nome, última mensagem e link para o chat", () => {
    renderItem();
    expect(screen.getByText("Mariana Lopes")).toBeInTheDocument();
    expect(screen.getByText("Minha internet caiu de novo")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/conversations/c-1",
    );
  });

  it("mostra o contador de não lidas", () => {
    renderItem();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("não mostra badge quando tudo foi lido", () => {
    renderItem({ unread: 0 });
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("marca a conversa ativa com aria-current", () => {
    renderItem({}, true);
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "page");
  });
});
