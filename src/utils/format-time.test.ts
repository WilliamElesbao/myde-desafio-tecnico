import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatConversationTime, formatMessageTime } from "./format-time";

describe("formatMessageTime", () => {
  it("formata como HH:mm", () => {
    const date = new Date(2026, 5, 11, 14, 32).toISOString();
    expect(formatMessageTime(date)).toBe("14:32");
  });
});

describe("formatConversationTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 11, 18, 0)); // qui, 11/06/2026
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retorna hora para datas de hoje", () => {
    expect(
      formatConversationTime(new Date(2026, 5, 11, 9, 5).toISOString()),
    ).toBe("09:05");
  });

  it("retorna 'Ontem' para datas de ontem", () => {
    expect(
      formatConversationTime(new Date(2026, 5, 10, 9, 0).toISOString()),
    ).toBe("Ontem");
  });

  it("retorna dia da semana dentro dos últimos 7 dias", () => {
    expect(
      formatConversationTime(new Date(2026, 5, 8, 9, 0).toISOString()),
    ).toBe("segunda-feira");
  });

  it("retorna data completa para mais antigo que uma semana", () => {
    expect(
      formatConversationTime(new Date(2026, 4, 1, 9, 0).toISOString()),
    ).toBe("01/05/2026");
  });
});
