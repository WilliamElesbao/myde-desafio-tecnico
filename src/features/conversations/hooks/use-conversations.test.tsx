import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { useConversations } from "./use-conversations";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  getConversations: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useConversations", () => {
  it("retorna as conversas da API", async () => {
    const conversations = [
      {
        id: "c-1",
        contactName: "Mariana",
        contactPhone: "55",
        avatarColor: "#fff",
        unread: 1,
        lastMessage: "oi",
        lastMessageAt: "2026-06-11T11:00:00.000Z",
      },
    ];
    vi.mocked(api.getConversations).mockResolvedValue(conversations);

    const { result } = renderHook(() => useConversations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(conversations);
  });

  it("expõe o erro quando a API falha", async () => {
    vi.mocked(api.getConversations).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useConversations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
