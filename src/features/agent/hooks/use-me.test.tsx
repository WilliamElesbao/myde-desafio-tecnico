import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { useMe } from "./use-me";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  getMe: vi.fn(),
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

describe("useMe", () => {
  it("retorna o perfil do atendente", async () => {
    const me = { id: "agent-1", name: "Atendente Myde", role: "Suporte" };
    vi.mocked(api.getMe).mockResolvedValue(me);

    const { result } = renderHook(() => useMe(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(me);
  });
});
