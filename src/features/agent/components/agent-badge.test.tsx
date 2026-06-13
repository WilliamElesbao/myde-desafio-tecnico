import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { AgentBadge } from "./agent-badge";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  getMe: vi.fn(),
}));

function renderWithClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("AgentBadge", () => {
  it("mostra nome e cargo do atendente", async () => {
    vi.mocked(api.getMe).mockResolvedValue({
      id: "agent-1",
      name: "Atendente Myde",
      role: "Suporte NeoFibra",
    });

    renderWithClient(<AgentBadge />);

    expect(await screen.findByText("Atendente Myde")).toBeInTheDocument();
    expect(screen.getByText("Suporte NeoFibra")).toBeInTheDocument();
  });

  it("mostra alerta quando o perfil falha", async () => {
    vi.mocked(api.getMe).mockRejectedValue(new Error("boom"));

    renderWithClient(<AgentBadge />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar seu perfil.",
    );
  });
});
