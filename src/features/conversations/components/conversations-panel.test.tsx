import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { ConversationsPanel } from "./conversations-panel";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  getConversations: vi.fn(),
}));

// vi.hoisted: vi.mock is hoisted to the top, so the mock needs to exist beforehand
const { useParamsMock } = vi.hoisted(() => ({
  useParamsMock: vi.fn<() => { conversationId?: string }>(() => ({})),
}));

vi.mock("next/navigation", () => ({
  useParams: useParamsMock,
}));

const conversations: api.Conversation[] = [
  {
    id: "c-1",
    contactName: "Mariana Lopes",
    contactPhone: "5511988887766",
    avatarColor: "#25D366",
    unread: 2,
    lastMessage: "Minha internet caiu",
    lastMessageAt: new Date().toISOString(),
  },
  {
    id: "c-2",
    contactName: "Rafael Augusto",
    contactPhone: "5511977776655",
    avatarColor: "#34B7F1",
    unread: 0,
    lastMessage: "Obrigado!",
    lastMessageAt: new Date().toISOString(),
  },
];

function renderWithClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("ConversationsPanel", () => {
  it("mostra skeleton enquanto carrega", () => {
    vi.mocked(api.getConversations).mockReturnValue(new Promise(() => {}));
    renderWithClient(<ConversationsPanel />);
    expect(
      screen.getByRole("status", { name: "Carregando conversas" }),
    ).toBeInTheDocument();
  });

  it("renderiza a lista após carregar", async () => {
    vi.mocked(api.getConversations).mockResolvedValue(conversations);
    renderWithClient(<ConversationsPanel />);

    expect(await screen.findByText("Mariana Lopes")).toBeInTheDocument();
    expect(screen.getByText("Rafael Augusto")).toBeInTheDocument();
  });

  it("filtra pela busca (com debounce)", async () => {
    const user = userEvent.setup();
    vi.mocked(api.getConversations).mockResolvedValue(conversations);
    renderWithClient(<ConversationsPanel />);

    await screen.findByText("Mariana Lopes");
    await user.type(screen.getByRole("searchbox"), "rafael");

    await waitFor(() =>
      expect(screen.queryByText("Mariana Lopes")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Rafael Augusto")).toBeInTheDocument();
  });

  it("destaca a conversa ativa da URL", async () => {
    useParamsMock.mockReturnValue({ conversationId: "c-2" });
    vi.mocked(api.getConversations).mockResolvedValue(conversations);
    renderWithClient(<ConversationsPanel />);

    expect(
      await screen.findByRole("link", { name: /Rafael Augusto/ }),
    ).toHaveAttribute("aria-current", "page");
    useParamsMock.mockReturnValue({});
  });

  it("mostra erro com botão de retry", async () => {
    vi.mocked(api.getConversations).mockRejectedValue(new Error("boom"));
    renderWithClient(<ConversationsPanel />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Erro ao carregar conversas",
    );

    vi.mocked(api.getConversations).mockResolvedValue(conversations);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Mariana Lopes")).toBeInTheDocument();
  });
});
