import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { conversations, messages } from "../../../../e2e/support/mock-api";
import { ChatPanel } from "./chat-panel";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  getConversations: vi.fn(),
  getMessages: vi.fn(),
  sendMessage: vi.fn(),
  suggestReply: vi.fn(),
}));

// ChatPanel reads the active conversation from the URL (useParams)
const { useParamsMock } = vi.hoisted(() => ({
  useParamsMock: vi.fn<() => { conversationId: string }>(() => ({
    conversationId: "c-1001",
  })),
}));

vi.mock("next/navigation", () => ({
  useParams: useParamsMock,
}));

const conversation = conversations[0];

function renderPanel(conversationId = "c-1001") {
  useParamsMock.mockReturnValue({ conversationId });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ChatPanel />
    </QueryClientProvider>,
  );
}

describe("ChatPanel", () => {
  it("mostra skeleton enquanto carrega mensagens", () => {
    vi.mocked(api.getConversations).mockResolvedValue([conversation]);
    vi.mocked(api.getMessages).mockReturnValue(new Promise(() => {}));

    renderPanel();
    expect(
      screen.getByRole("status", { name: "Carregando mensagens" }),
    ).toBeInTheDocument();
  });

  it("renderiza header e mensagens", async () => {
    vi.mocked(api.getConversations).mockResolvedValue([conversation]);
    vi.mocked(api.getMessages).mockResolvedValue(messages);

    renderPanel();

    expect(
      await screen.findByRole("heading", { name: "Mariana Lopes" }),
    ).toBeInTheDocument();
    expect(await screen.findByText("Bom dia")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Mensagem" }),
    ).toBeInTheDocument();
  });

  it("mantém header e composer montados enquanto as mensagens carregam", () => {
    vi.mocked(api.getConversations).mockResolvedValue([conversation]);
    vi.mocked(api.getMessages).mockReturnValue(new Promise(() => {}));

    renderPanel();

    // the skeleton replaces only the messages area, never the shell
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Mensagem" }),
    ).toBeInTheDocument();
  });

  it("mostra erro com retry quando as mensagens falham", async () => {
    vi.mocked(api.getConversations).mockResolvedValue([conversation]);
    vi.mocked(api.getMessages).mockRejectedValue(new Error("boom"));

    renderPanel();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Erro ao carregar mensagens",
    );
  });

  it("mostra estado de conversa não encontrada", async () => {
    vi.mocked(api.getConversations).mockResolvedValue([conversation]);
    vi.mocked(api.getMessages).mockResolvedValue([]);

    renderPanel("c-inexistente");

    expect(
      await screen.findByText("Conversa não encontrada"),
    ).toBeInTheDocument();
  });
});
