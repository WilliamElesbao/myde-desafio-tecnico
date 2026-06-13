import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { conversations } from "../../../../e2e/support/mock-api";
import { ConversationList } from "./conversation-list";

describe("ConversationList", () => {
  it("renderiza todos os itens", () => {
    render(<ConversationList conversations={conversations} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("marca a conversa ativa", () => {
    render(
      <ConversationList
        conversations={conversations}
        activeConversationId="c-1002"
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
