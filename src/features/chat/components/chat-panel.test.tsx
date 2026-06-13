import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
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
    conversationId: "c-1",
  })),
}));

vi.mock("next/navigation", () => ({
  useParams: useParamsMock,
}));

const conversation: api.Conversation = {
  id: "c-1",
  contactName: "Mariana Lopes",
  contactPhone: "5511988887766",
  avatarColor: "#25D366",
  unread: 2,
  lastMessage: "Minha internet caiu",
  lastMessageAt: new Date().toISOString(),
};

const messages: api.Message[] = [
  {
    id: "m-1",
    direction: "in",
    body: "Bom dia",
    status: "read",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m-2",
    direction: "in",
    body: "Minha internet caiu",
    status: "read",
    createdAt: new Date().toISOString(),
  },
];

function renderPanel(conversationId = "c-1") {
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
