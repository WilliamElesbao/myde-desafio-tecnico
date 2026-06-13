import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ChatMessage } from "../types";
import { MessageList } from "./message-list";

function makeMessage(id: string, body = id): ChatMessage {
  return {
    id,
    body,
    direction: "in",
    status: "read",
    createdAt: new Date().toISOString(),
  };
}

describe("MessageList", () => {
  it("renderiza as mensagens", () => {
    render(
      <MessageList
        messages={[makeMessage("m-1", "oi"), makeMessage("m-2", "tudo bem?")]}
        hasOlderMessages={false}
        isLoadingOlder={false}
        onLoadOlder={() => {}}
      />,
    );
    expect(screen.getByText("oi")).toBeInTheDocument();
    expect(screen.getByText("tudo bem?")).toBeInTheDocument();
  });

  it("mostra estado vazio sem mensagens", () => {
    render(
      <MessageList
        messages={[]}
        hasOlderMessages={false}
        isLoadingOlder={false}
        onLoadOlder={() => {}}
      />,
    );
    expect(screen.getByText("Nenhuma mensagem ainda")).toBeInTheDocument();
  });

  it("carrega mensagens antigas pelo botão", async () => {
    const user = userEvent.setup();
    const onLoadOlder = vi.fn();
    render(
      <MessageList
        messages={[makeMessage("m-1")]}
        hasOlderMessages
        isLoadingOlder={false}
        onLoadOlder={onLoadOlder}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Carregar mensagens anteriores" }),
    );
    expect(onLoadOlder).toHaveBeenCalled();
  });

  it("desabilita o botão enquanto carrega", () => {
    render(
      <MessageList
        messages={[makeMessage("m-1")]}
        hasOlderMessages
        isLoadingOlder
        onLoadOlder={() => {}}
      />,
    );
    expect(screen.getByRole("button", { name: "Carregando…" })).toBeDisabled();
  });

  it("não mostra o botão quando não há mensagens antigas", () => {
    render(
      <MessageList
        messages={[makeMessage("m-1")]}
        hasOlderMessages={false}
        isLoadingOlder={false}
        onLoadOlder={() => {}}
      />,
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
