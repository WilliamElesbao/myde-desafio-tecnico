import { describe, expect, it } from "vitest";
import type { ChatMessage, MessagesInfiniteData } from "../types";
import {
  appendMessage,
  flattenMessages,
  replaceMessage,
} from "./messages-cache";

function makeMessage(id: string, body = id): ChatMessage {
  return {
    id,
    body,
    direction: "in",
    status: "read",
    createdAt: "2026-06-11T10:00:00.000Z",
  };
}

const data: MessagesInfiniteData = {
  // pages[0] = most recent; pages[1] = older
  pages: [
    { messages: [makeMessage("m-3"), makeMessage("m-4")], prevCursor: 2 },
    { messages: [makeMessage("m-1"), makeMessage("m-2")], prevCursor: null },
  ],
  pageParams: [0, 2],
};

describe("flattenMessages", () => {
  it("retorna ordem cronológica (antigas primeiro)", () => {
    expect(flattenMessages(data).map((m) => m.id)).toEqual([
      "m-1",
      "m-2",
      "m-3",
      "m-4",
    ]);
  });

  it("deduplica por id quando páginas se sobrepõem", () => {
    const overlapping: MessagesInfiniteData = {
      pages: [
        { messages: [makeMessage("m-2"), makeMessage("m-3")], prevCursor: 1 },
        {
          messages: [makeMessage("m-1"), makeMessage("m-2")],
          prevCursor: null,
        },
      ],
      pageParams: [0, 1],
    };
    expect(flattenMessages(overlapping).map((m) => m.id)).toEqual([
      "m-1",
      "m-2",
      "m-3",
    ]);
  });

  it("retorna vazio sem cache", () => {
    expect(flattenMessages(undefined)).toEqual([]);
  });
});

describe("appendMessage", () => {
  it("acrescenta na página mais recente", () => {
    const result = appendMessage(data, makeMessage("m-5"));
    expect(result.pages[0].messages.map((m) => m.id)).toEqual([
      "m-3",
      "m-4",
      "m-5",
    ]);
    expect(result.pages[1].messages).toHaveLength(2);
  });

  it("cria estrutura inicial quando o cache está vazio", () => {
    const result = appendMessage(undefined, makeMessage("m-1"));
    expect(result.pages).toHaveLength(1);
    expect(result.pages[0].messages.map((m) => m.id)).toEqual(["m-1"]);
    expect(result.pageParams).toEqual([0]);
  });

  it("não muta o cache original", () => {
    appendMessage(data, makeMessage("m-9"));
    expect(data.pages[0].messages).toHaveLength(2);
  });
});

describe("replaceMessage", () => {
  it("substitui a mensagem otimista pela salva", () => {
    const withOptimistic = appendMessage(data, {
      ...makeMessage("optimistic-1"),
      status: "sending",
    });

    const saved = { ...makeMessage("m-5"), direction: "out" as const };
    const result = replaceMessage(withOptimistic, "optimistic-1", saved);

    const ids = flattenMessages(result).map((m) => m.id);
    expect(ids).toContain("m-5");
    expect(ids).not.toContain("optimistic-1");
  });

  it("retorna undefined sem cache", () => {
    expect(replaceMessage(undefined, "x", makeMessage("m-1"))).toBeUndefined();
  });
});
