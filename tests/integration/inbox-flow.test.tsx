import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InboxShell } from "@/components/layout/inbox-shell";
import { ConnectionStatusProvider } from "@/contexts/connection-status-context";
import { AgentBadge } from "@/features/agent/components/agent-badge";
import { ConversationsPanel } from "@/features/conversations/components/conversations-panel";
import * as api from "@/lib/http/api";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  getMe: vi.fn(),
  getConversations: vi.fn(),
}));

// The shell and the list read the active conversation from the URL (useParams)
const { useParamsMock } = vi.hoisted(() => ({
  useParamsMock: vi.fn<() => { conversationId?: string }>(() => ({})),
}));

vi.mock("next/navigation", () => ({
  useParams: useParamsMock,
}));

const me: api.Agent = {
  id: "agent-1",
  name: "Atendente Myde",
  role: "Suporte NeoFibra",
};

const conversations: api.Conversation[] = [
  {
    id: "c-1001",
    contactName: "Mariana Lopes",
    contactPhone: "5511988887766",
    avatarColor: "#25D366",
    unread: 2,
    lastMessage: "Minha internet caiu de novo",
    lastMessageAt: new Date().toISOString(),
  },
  {
    id: "c-1002",
    contactName: "Rafael Augusto",
    contactPhone: "5511977776655",
    avatarColor: "#34B7F1",
    unread: 0,
    lastMessage: "Perfeito, obrigado!",
    lastMessageAt: new Date().toISOString(),
  },
];

/** Reproduces the root layout composition (src/app/layout.tsx) on the client. */
function renderInbox() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ConnectionStatusProvider>
        <InboxShell
          sidebar={
            <>
              <AgentBadge />
              <ConversationsPanel />
            </>
          }
        >
          <div>painel direito</div>
        </InboxShell>
      </ConnectionStatusProvider>
    </QueryClientProvider>,
  );
}

describe("fluxo do inbox (integração)", () => {
  it("carrega perfil + conversas e permite buscar e navegar", async () => {
    const user = userEvent.setup();
    vi.mocked(api.getMe).mockResolvedValue(me);
    vi.mocked(api.getConversations).mockResolvedValue(conversations);

    renderInbox();

    // profile and list loaded in parallel
    expect(await screen.findByText("Atendente Myde")).toBeInTheDocument();
    expect(await screen.findByText("Mariana Lopes")).toBeInTheDocument();

    // unread badge
    expect(screen.getByText("2")).toBeInTheDocument();

    // the link points to the chat screen
    expect(screen.getByRole("link", { name: /Mariana Lopes/ })).toHaveAttribute(
      "href",
      "/conversations/c-1001",
    );

    // search filters the list
    await user.type(screen.getByRole("searchbox"), "rafael");
    await waitFor(() =>
      expect(screen.queryByText("Mariana Lopes")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Rafael Augusto")).toBeInTheDocument();

    // clearing the search restores the list
    await user.clear(screen.getByRole("searchbox"));
    expect(await screen.findByText("Mariana Lopes")).toBeInTheDocument();
  });

  it("mostra estado vazio quando a busca não encontra nada", async () => {
    const user = userEvent.setup();
    vi.mocked(api.getMe).mockResolvedValue(me);
    vi.mocked(api.getConversations).mockResolvedValue(conversations);

    renderInbox();
    await screen.findByText("Mariana Lopes");

    await user.type(screen.getByRole("searchbox"), "zzz");
    expect(await screen.findByText("Nenhum resultado")).toBeInTheDocument();
  });
});
