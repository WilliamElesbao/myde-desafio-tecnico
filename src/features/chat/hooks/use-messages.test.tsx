import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { MessagesInfiniteData } from "../types";
import { useMessages } from "./use-messages";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  getMessages: vi.fn(),
}));

function makeMessages(count: number): api.Message[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `m-${index + 1}`,
    direction: "in" as const,
    body: `mensagem ${index + 1}`,
    status: "read" as const,
    createdAt: new Date(2026, 5, 11, 10, index).toISOString(),
  }));
}

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const rendered = renderHook(() => useMessages("c-1"), { wrapper });
  return { queryClient, ...rendered };
}

describe("useMessages", () => {
  it("retorna a primeira página (mais recentes) em ordem cronológica", async () => {
    vi.mocked(api.getMessages).mockResolvedValue(makeMessages(25));

    const { result } = setup();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // page of 20 over 25 messages → m-6..m-25
    expect(result.current.data).toHaveLength(20);
    expect(result.current.data?.[0].id).toBe("m-6");
    expect(result.current.data?.at(-1)?.id).toBe("m-25");
    expect(result.current.hasNextPage).toBe(true);
  });

  it("fetchNextPage carrega as mensagens mais antigas", async () => {
    vi.mocked(api.getMessages).mockResolvedValue(makeMessages(25));

    const { queryClient, result } = setup();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    await waitFor(() => expect(result.current.hasNextPage).toBe(true));

    await act(async () => {
      await result.current.fetchNextPage();
    });

    // the cache now has both pages (recent + old)
    await waitFor(() => {
      const cached = queryClient.getQueryData<MessagesInfiniteData>(
        queryKeys.messages("c-1"),
      );
      expect(cached?.pages).toHaveLength(2);
    });

    await waitFor(() => expect(result.current.data).toHaveLength(25));
    expect(result.current.data?.[0].id).toBe("m-1");
    expect(result.current.hasNextPage).toBe(false);
  });

  it("não há próxima página quando o histórico é curto", async () => {
    vi.mocked(api.getMessages).mockResolvedValue(makeMessages(3));

    const { result } = setup();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });
});
