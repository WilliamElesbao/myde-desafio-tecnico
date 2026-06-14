import type { Page, Route } from "@playwright/test";
import type { Conversation, Message } from "@/lib/http/api";

export const me = {
  id: "agent-1",
  name: "Atendente Myde",
  role: "Suporte NeoFibra",
};

export const conversations: Conversation[] = [
  {
    id: "c-1001",
    contactName: "Mariana Lopes",
    contactPhone: "5511988887766",
    avatarColor: "#25D366",
    unread: 2,
    lastMessage: "Minha internet caiu de novo agora de manhã",
    lastMessageAt: new Date().toISOString(),
  },
  {
    id: "c-1002",
    contactName: "Rafael Augusto",
    contactPhone: "5511977776655",
    avatarColor: "#34B7F1",
    unread: 0,
    lastMessage: "Perfeito, obrigado pela ajuda!",
    lastMessageAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
];

export const messages: Message[] = [
  {
    id: "m-1",
    direction: "in",
    body: "Bom dia",
    status: "read",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "m-2",
    direction: "in",
    body: "Minha internet caiu de novo agora de manhã",
    status: "read",
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];

function json(route: Route, body: unknown, status = 200) {
  return route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

type MockApiOptions = {
  /** Delay of the message POST, to observe the optimistic state. */
  sendDelayMs?: number;
};

/** Intercepts every API route in the browser (hermetic test, no network). */
export async function mockApi(page: Page, options: MockApiOptions = {}) {
  // Skip the first-visit splash so specs target the feature directly (the
  // server reads this cookie and omits the splash). Port-agnostic via domain.
  await page.context().addCookies([
    {
      name: "neofibra_splash_seen",
      value: "true",
      domain: "localhost",
      path: "/",
    },
  ]);

  // local copy: every test starts from the same history
  const conversationMessages = messages.map((message) => ({ ...message }));

  await page.route("**/e2e-api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname.replace(/^\/e2e-api/, "");
    const method = request.method();

    if (method === "GET" && pathname === "/me") {
      return json(route, me);
    }

    if (method === "GET" && pathname === "/conversations") {
      return json(route, conversations);
    }

    if (
      method === "GET" &&
      /^\/conversations\/[^/]+\/messages$/.test(pathname)
    ) {
      return json(route, conversationMessages);
    }

    if (
      method === "POST" &&
      /^\/conversations\/[^/]+\/messages$/.test(pathname)
    ) {
      if (options.sendDelayMs) {
        await new Promise((resolve) =>
          setTimeout(resolve, options.sendDelayMs),
        );
      }
      const { text } = request.postDataJSON() as { text: string };
      const saved: Message = {
        id: `m-${Date.now()}`,
        direction: "out",
        body: text,
        status: "sent",
        createdAt: new Date().toISOString(),
      };
      conversationMessages.push(saved);
      return json(route, saved, 201);
    }

    if (method === "POST" && pathname === "/ai/suggest") {
      return json(route, {
        suggestion:
          "Lamento pelo transtorno! Já estou verificando sua conexão.",
        source: "mock",
      });
    }

    return json(route, { message: "rota não mockada" }, 404);
  });
}
