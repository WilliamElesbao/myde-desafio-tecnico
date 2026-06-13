import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { MessageComposer } from "./message-composer";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  sendMessage: vi.fn(),
  suggestReply: vi.fn(),
}));

function renderComposer() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MessageComposer conversationId="c-1" />
    </QueryClientProvider>,
  );
}

describe("MessageComposer", () => {
  it("desabilita enviar com campo vazio", () => {
    renderComposer();
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();
  });

  it("envia a mensagem e limpa o campo", async () => {
    const user = userEvent.setup();
    vi.mocked(api.sendMessage).mockResolvedValue({
      id: "m-1",
      direction: "out",
      body: "olá",
      status: "sent",
      createdAt: new Date().toISOString(),
    });

    renderComposer();
    const input = screen.getByRole("textbox", { name: "Mensagem" });
    await user.type(input, "olá");
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    expect(api.sendMessage).toHaveBeenCalledWith("c-1", "olá");
    expect(input).toHaveValue("");
  });

  it("Enter envia e Shift+Enter quebra linha", async () => {
    const user = userEvent.setup();
    vi.mocked(api.sendMessage).mockResolvedValue({
      id: "m-1",
      direction: "out",
      body: "linha 1\nlinha 2",
      status: "sent",
      createdAt: new Date().toISOString(),
    });

    renderComposer();
    const input = screen.getByRole("textbox", { name: "Mensagem" });

    await user.type(input, "linha 1");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    await user.type(input, "linha 2");
    expect(input).toHaveValue("linha 1\nlinha 2");
    expect(api.sendMessage).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(api.sendMessage).toHaveBeenCalledWith("c-1", "linha 1\nlinha 2"),
    );
    expect(input).toHaveValue("");
  });

  it("não envia mensagem só com espaços", async () => {
    const user = userEvent.setup();
    renderComposer();

    const input = screen.getByRole("textbox", { name: "Mensagem" });
    await user.type(input, "   ");
    expect(screen.getByRole("button", { name: "Enviar" })).toBeDisabled();

    // Enter submits the form, but the zod resolver rejects blank messages
    await user.keyboard("{Enter}");
    expect(api.sendMessage).not.toHaveBeenCalled();
  });
});
