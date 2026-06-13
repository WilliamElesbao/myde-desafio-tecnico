import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChatPanel } from "@/features/chat/components/chat-panel";
import * as api from "@/lib/http/api";

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

const conversation: api.Conversation = {
  id: "c-1001",
  contactName: "Mariana Lopes",
  contactPhone: "5511988887766",
  avatarColor: "#25D366",
  unread: 2,
  lastMessage: "Minha internet caiu de novo",
  lastMessageAt: new Date().toISOString(),
};

const otherConversation: api.Conversation = {
  id: "c-1002",
  contactName: "Rafael Augusto",
  contactPhone: "5511977776655",
  avatarColor: "#34B7F1",
  unread: 0,
  lastMessage: "Perfeito, obrigado!",
  lastMessageAt: new Date().toISOString(),
};

const history: api.Message[] = [
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
    body: "Minha internet caiu de novo",
    status: "read",
    createdAt: new Date().toISOString(),
  },
];

/**
 * Stateful mock: like the real API, sent messages become part of the
 * history — the refetch triggered by the onSettled invalidation must return
 * the confirmed message, otherwise it would "vanish" from the chat.
 */
let serverMessages: api.Message[];

function buildSavedMessage(text: string): api.Message {
  return {
    id: `m-${serverMessages.length + 1}`,
    direction: "out",
    body: text,
    status: "sent",
    createdAt: new Date().toISOString(),
  };
}

beforeEach(() => {
  serverMessages = [...history];
  useParamsMock.mockReturnValue({ conversationId: "c-1001" });
  vi.mocked(api.getConversations).mockResolvedValue([
    conversation,
    otherConversation,
  ]);
  vi.mocked(api.getMessages).mockImplementation(async () => serverMessages);
});

function renderChat() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const view = render(
    <QueryClientProvider client={queryClient}>
      <ChatPanel />
    </QueryClientProvider>,
  );
  // Switching conversation = the URL param changes and the panel re-renders
  const switchConversation = (nextConversationId: string) => {
    useParamsMock.mockReturnValue({ conversationId: nextConversationId });
    view.rerender(
      <QueryClientProvider client={queryClient}>
        <ChatPanel />
      </QueryClientProvider>,
    );
  };
  return { ...view, switchConversation };
}

describe("fluxo do chat (integração)", () => {
  it("envia mensagem com update otimista: aparece antes da confirmação", async () => {
    const user = userEvent.setup();

    let resolveSend: () => void = () => {};
    vi.mocked(api.sendMessage).mockImplementation(
      (_conversationId, text) =>
        new Promise((resolve) => {
          resolveSend = () => {
            const saved = buildSavedMessage(text);
            serverMessages = [...serverMessages, saved];
            resolve(saved);
          };
        }),
    );

    renderChat();
    await screen.findByText("Bom dia");

    await user.type(
      screen.getByRole("textbox", { name: "Mensagem" }),
      "Vou verificar sua conexão",
    );
    await user.click(screen.getByRole("button", { name: "Enviar" }));

    // the message appears BEFORE the server responds, with sending status
    expect(
      await screen.findByText("Vou verificar sua conexão"),
    ).toBeInTheDocument();
    expect(screen.getByText("Enviando")).toBeInTheDocument();

    // server confirms → status updated and the message remains
    resolveSend();
    await waitFor(() =>
      expect(screen.queryByText("Enviando")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Vou verificar sua conexão")).toBeInTheDocument();
  });

  it("sugestão da IA preenche o composer e pode ser enviada", async () => {
    const user = userEvent.setup();
    const suggestion =
      "Lamento pelo transtorno! Já estou verificando sua conexão.";
    vi.mocked(api.suggestReply).mockResolvedValue({
      suggestion,
      source: "mock",
    });
    vi.mocked(api.sendMessage).mockImplementation(async (_id, text) => {
      const saved = buildSavedMessage(text);
      serverMessages = [...serverMessages, saved];
      return saved;
    });

    renderChat();
    await screen.findByText("Bom dia");

    await user.click(
      screen.getByRole("button", { name: "Sugerir resposta com IA" }),
    );

    const input = screen.getByRole("textbox", { name: "Mensagem" });
    await waitFor(() => expect(input).toHaveValue(suggestion));

    await user.click(screen.getByRole("button", { name: "Enviar" }));
    expect(api.sendMessage).toHaveBeenCalledWith("c-1001", suggestion);
    expect(input).toHaveValue("");
    expect(await screen.findByText(suggestion)).toBeInTheDocument();
  });

  it("limpa o rascunho não enviado ao trocar de conversa (sem remontar o composer)", async () => {
    const user = userEvent.setup();

    const { switchConversation } = renderChat();
    await screen.findByText("Bom dia");

    const input = screen.getByRole("textbox", { name: "Mensagem" });
    await user.type(input, "rascunho não enviado");
    expect(input).toHaveValue("rascunho não enviado");

    // switching conversations keeps the SAME composer mounted, draft cleared
    switchConversation("c-1002");
    await waitFor(() => expect(input).toHaveValue(""));
    expect(input).toBeInTheDocument();
    expect(api.sendMessage).not.toHaveBeenCalled();
  });
});
