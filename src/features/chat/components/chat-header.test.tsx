import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { conversations } from "../../../../e2e/support/mock-api";
import { ChatHeader } from "./chat-header";

const conversation = conversations[0];

describe("ChatHeader", () => {
  it("mostra nome e telefone do contato", () => {
    render(<ChatHeader conversation={conversation} />);
    expect(
      screen.getByRole("heading", { name: "Mariana Lopes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("+5511988887766")).toBeInTheDocument();
  });

  it("tem link de voltar para a lista (mobile)", () => {
    render(<ChatHeader conversation={conversation} />);
    expect(
      screen.getByRole("link", { name: "Voltar para a lista de conversas" }),
    ).toHaveAttribute("href", "/");
  });
});
