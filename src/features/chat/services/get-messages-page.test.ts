import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import { LATEST_PAGE_CURSOR } from "../constants/pagination";
import { getMessagesPage } from "./get-messages-page";

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

describe("getMessagesPage", () => {
  it("primeira página: retorna as mais recentes com cursor para as antigas", async () => {
    vi.mocked(api.getMessages).mockResolvedValue(makeMessages(5));

    const page = await getMessagesPage("c-1", LATEST_PAGE_CURSOR, 2);

    expect(page.messages.map((m) => m.id)).toEqual(["m-4", "m-5"]);
    expect(page.prevCursor).toBe(3);
  });

  it("página seguinte: fatia anterior ao cursor", async () => {
    vi.mocked(api.getMessages).mockResolvedValue(makeMessages(5));

    const page = await getMessagesPage("c-1", 3, 2);

    expect(page.messages.map((m) => m.id)).toEqual(["m-2", "m-3"]);
    expect(page.prevCursor).toBe(1);
  });

  it("última página: sem cursor quando chega ao início", async () => {
    vi.mocked(api.getMessages).mockResolvedValue(makeMessages(5));

    const page = await getMessagesPage("c-1", 1, 2);

    expect(page.messages.map((m) => m.id)).toEqual(["m-1"]);
    expect(page.prevCursor).toBeNull();
  });

  it("histórico menor que a página: retorna tudo sem cursor", async () => {
    vi.mocked(api.getMessages).mockResolvedValue(makeMessages(2));

    const page = await getMessagesPage("c-1", LATEST_PAGE_CURSOR, 20);

    expect(page.messages).toHaveLength(2);
    expect(page.prevCursor).toBeNull();
  });

  it("cursor maior que o histórico (mensagens removidas): não estoura", async () => {
    vi.mocked(api.getMessages).mockResolvedValue(makeMessages(3));

    const page = await getMessagesPage("c-1", 10, 2);

    expect(page.messages.map((m) => m.id)).toEqual(["m-2", "m-3"]);
    expect(page.prevCursor).toBe(1);
  });
});
