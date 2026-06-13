import { describe, expect, it, vi } from "vitest";
import {
  api,
  getConversations,
  getMe,
  getMessages,
  sendMessage,
  suggestReply,
} from "./api";

describe("lib/api", () => {
  it("getMe chama GET /me", async () => {
    const me = { id: "agent-1", name: "Atendente", role: "Suporte" };
    vi.spyOn(api, "get").mockResolvedValueOnce({ data: me });

    await expect(getMe()).resolves.toEqual(me);
    expect(api.get).toHaveBeenCalledWith("/me");
  });

  it("getConversations chama GET /conversations", async () => {
    vi.spyOn(api, "get").mockResolvedValueOnce({ data: [] });

    await expect(getConversations()).resolves.toEqual([]);
    expect(api.get).toHaveBeenCalledWith("/conversations");
  });

  it("getMessages chama GET /conversations/:id/messages", async () => {
    vi.spyOn(api, "get").mockResolvedValueOnce({ data: [] });

    await getMessages("c-1");
    expect(api.get).toHaveBeenCalledWith("/conversations/c-1/messages");
  });

  it("sendMessage faz POST com { text }", async () => {
    const saved = {
      id: "m-1",
      direction: "out",
      body: "olá",
      status: "sent",
      createdAt: "2026-06-11T12:00:00.000Z",
    };
    vi.spyOn(api, "post").mockResolvedValueOnce({ data: saved });

    await expect(sendMessage("c-1", "olá")).resolves.toEqual(saved);
    expect(api.post).toHaveBeenCalledWith("/conversations/c-1/messages", {
      text: "olá",
    });
  });

  it("suggestReply faz POST com { conversationId }", async () => {
    const suggestion = { suggestion: "Posso ajudar?", source: "mock" };
    vi.spyOn(api, "post").mockResolvedValueOnce({ data: suggestion });

    await expect(suggestReply("c-1")).resolves.toEqual(suggestion);
    expect(api.post).toHaveBeenCalledWith("/ai/suggest", {
      conversationId: "c-1",
    });
  });
});
