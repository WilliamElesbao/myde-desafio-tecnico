import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { useAiSuggestion } from "./use-ai-suggestion";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  suggestReply: vi.fn(),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useAiSuggestion", () => {
  it("entrega a sugestão via onSuggestion", async () => {
    vi.mocked(api.suggestReply).mockResolvedValue({
      suggestion: "Lamento pelo ocorrido! Vou verificar sua conexão.",
      source: "mock",
    });
    const onSuggestion = vi.fn();

    const { result } = renderHook(
      () => useAiSuggestion("c-1", { onSuggestion }),
      { wrapper: createWrapper() },
    );

    act(() => {
      result.current.mutate();
    });

    await waitFor(() =>
      expect(onSuggestion).toHaveBeenCalledWith(
        "Lamento pelo ocorrido! Vou verificar sua conexão.",
      ),
    );
    expect(api.suggestReply).toHaveBeenCalledWith("c-1");
  });

  it("expõe erro quando a API falha", async () => {
    vi.mocked(api.suggestReply).mockRejectedValue(new Error("boom"));
    const onSuggestion = vi.fn();

    const { result } = renderHook(
      () => useAiSuggestion("c-1", { onSuggestion }),
      { wrapper: createWrapper() },
    );

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(onSuggestion).not.toHaveBeenCalled();
  });
});
