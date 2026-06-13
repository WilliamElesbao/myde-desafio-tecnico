import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Conversation } from "@/lib/http/api";
import { ChatHeader } from "./chat-header";

const conversation: Conversation = {
  id: "c-1",
  contactName: "Mariana Lopes",
  contactPhone: "5511988887766",
  avatarColor: "#25D366",
  unread: 0,
  lastMessage: "oi",
  lastMessageAt: new Date().toISOString(),
};

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
