import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { queryKeys } from "@/lib/react-query/query-keys";
import type { MessagesInfiniteData } from "../types";
import { flattenMessages } from "../utils/messages-cache";
import { useSendMessage } from "./use-send-message";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  sendMessage: vi.fn(),
}));

const conversationId = "c-1";

function seedCaches(queryClient: QueryClient) {
  const initialData: MessagesInfiniteData = {
    pages: [
      {
        messages: [
          {
            id: "m-1",
            direction: "in",
            body: "oi",
            status: "read",
            createdAt: "2026-06-11T10:00:00.000Z",
          },
        ],
        prevCursor: null,
      },
    ],
    pageParams: [0],
  };
  queryClient.setQueryData(queryKeys.messages(conversationId), initialData);
  queryClient.setQueryData(queryKeys.conversations(), [
    {
      id: conversationId,
      contactName: "Mariana",
      contactPhone: "55",
      avatarColor: "#fff",
      unread: 1,
      lastMessage: "oi",
      lastMessageAt: "2026-06-11T10:00:00.000Z",
    },
  ] satisfies api.Conversation[]);
}

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  seedCaches(queryClient);

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => useSendMessage(conversationId), {
    wrapper,
  });
  return { queryClient, result };
}

function getCachedMessages(queryClient: QueryClient) {
  return flattenMessages(
    queryClient.getQueryData<MessagesInfiniteData>(
      queryKeys.messages(conversationId),
    ),
  );
}

describe("useSendMessage", () => {
  it("adiciona a mensagem otimista ao cache antes da resposta (onMutate)", async () => {
    let resolveSend: (message: api.Message) => void = () => {};
    vi.mocked(api.sendMessage).mockReturnValue(
      new Promise((resolve) => {
        resolveSend = resolve;
      }),
    );

    const { queryClient, result } = setup();

    act(() => {
      result.current.mutate("nova mensagem");
    });

    // before the server responds, the message is already in the cache
    await waitFor(() => {
      const messages = getCachedMessages(queryClient);
      expect(messages.at(-1)?.body).toBe("nova mensagem");
      expect(messages.at(-1)?.status).toBe("sending");
    });

    // and the sidebar reflects the last message
    const conversations = queryClient.getQueryData<api.Conversation[]>(
      queryKeys.conversations(),
    );
    expect(conversations?.[0].lastMessage).toBe("nova mensagem");

    resolveSend({
      id: "m-2",
      direction: "out",
      body: "nova mensagem",
      status: "sent",
      createdAt: "2026-06-11T10:01:00.000Z",
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("substitui a mensagem otimista pela confirmada (onSuccess)", async () => {
    vi.mocked(api.sendMessage).mockResolvedValue({
      id: "m-2",
      direction: "out",
      body: "nova mensagem",
      status: "sent",
      createdAt: "2026-06-11T10:01:00.000Z",
    });

    const { queryClient, result } = setup();

    await act(async () => {
      await result.current.mutateAsync("nova mensagem");
    });

    const messages = getCachedMessages(queryClient);
    expect(messages.at(-1)?.id).toBe("m-2");
    expect(messages.at(-1)?.status).toBe("sent");
    expect(
      messages.some((message) => message.id.startsWith("optimistic-")),
    ).toBe(false);
  });

  it("tenta de novo automaticamente uma vez e remove só a mensagem otimista no erro", async () => {
    vi.mocked(api.sendMessage).mockRejectedValue(new Error("rede caiu"));

    const { queryClient, result } = setup();

    act(() => {
      result.current.mutate("vai falhar");
    });

    // retry: 1 → two attempts (with backoff) before surfacing the error
    await waitFor(() => expect(result.current.isError).toBe(true), {
      timeout: 5000,
    });
    expect(api.sendMessage).toHaveBeenCalledTimes(2);

    // rollback by id: only this send's optimistic message is removed
    const messages = getCachedMessages(queryClient);
    expect(messages).toHaveLength(1);
    expect(messages[0].id).toBe("m-1");

    // the sidebar is not snapshot-restored: it self-corrects via invalidation
    expect(
      queryClient.getQueryState(queryKeys.conversations())?.isInvalidated,
    ).toBe(true);
  });

  it("um erro não apaga a mensagem otimista de um envio concorrente", async () => {
    // route by text: attempts are interleaved between the two mutations, so
    // ordered one-shot mocks would leak rejections across sends
    vi.mocked(api.sendMessage).mockImplementation((_id, text) =>
      text === "primeiro envio"
        ? Promise.reject(new Error("rede caiu"))
        : new Promise(() => {}),
    );

    const { queryClient, result } = setup();

    act(() => {
      result.current.mutate("primeiro envio");
      result.current.mutate("segundo envio");
    });

    await waitFor(() => {
      expect(getCachedMessages(queryClient)).toHaveLength(3);
    });

    // the hook result tracks the latest (still pending) mutation, so the
    // rollback of the first send is observed through the cache itself
    await waitFor(
      () => {
        const messages = getCachedMessages(queryClient);
        expect(messages.map((message) => message.body)).toEqual([
          "oi",
          "segundo envio",
        ]);
      },
      { timeout: 5000 },
    );
  });
});
