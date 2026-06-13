import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../types";
import { MessageBubble } from "./message-bubble";

function makeMessage(override: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: "m-1",
    direction: "in",
    body: "Bom dia",
    status: "read",
    createdAt: new Date(2026, 5, 11, 11, 40).toISOString(),
    ...override,
  };
}

function renderBubble(override: Partial<ChatMessage> = {}) {
  return render(
    <ul>
      <MessageBubble message={makeMessage(override)} />
    </ul>,
  );
}

describe("MessageBubble", () => {
  it("renderiza corpo e horário", () => {
    renderBubble();
    expect(screen.getByText("Bom dia")).toBeInTheDocument();
    expect(screen.getByText("11:40")).toBeInTheDocument();
  });

  it("identifica mensagens recebidas", () => {
    renderBubble({ direction: "in" });
    expect(
      screen.getByRole("listitem", { name: "Mensagem recebida" }),
    ).toBeInTheDocument();
  });

  it("identifica mensagens enviadas com status", () => {
    renderBubble({ direction: "out", status: "sending" });
    expect(
      screen.getByRole("listitem", { name: "Mensagem enviada" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Enviando")).toBeInTheDocument();
  });

  it("não mostra status em mensagens recebidas", () => {
    renderBubble({ direction: "in" });
    expect(screen.queryByText("Lida")).not.toBeInTheDocument();
  });
});
