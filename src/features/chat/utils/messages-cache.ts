import type { ChatMessage, MessagesInfiniteData, MessagesPage } from "../types";

export function flattenMessages(
  data: MessagesInfiniteData | undefined,
): ChatMessage[] {
  if (!data) return [];

  const seen = new Set<string>();
  const messages: ChatMessage[] = [];

  for (const page of [...data.pages].reverse()) {
    for (const message of page.messages) {
      if (!seen.has(message.id)) {
        seen.add(message.id);
        messages.push(message);
      }
    }
  }

  return messages;
}

export function appendMessage(
  data: MessagesInfiniteData | undefined,
  message: ChatMessage,
): MessagesInfiniteData {
  if (!data || data.pages.length === 0) {
    const page: MessagesPage = { messages: [message], prevCursor: null };
    return { pages: [page], pageParams: [0] };
  }

  const [latestPage, ...olderPages] = data.pages;
  return {
    ...data,
    pages: [
      { ...latestPage, messages: [...latestPage.messages, message] },
      ...olderPages,
    ],
  };
}

export function removeMessage(
  data: MessagesInfiniteData | undefined,
  messageId: string,
): MessagesInfiniteData | undefined {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      messages: page.messages.filter((message) => message.id !== messageId),
    })),
  };
}

export function replaceMessage(
  data: MessagesInfiniteData | undefined,
  optimisticId: string,
  saved: ChatMessage,
): MessagesInfiniteData | undefined {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      messages: page.messages.map((message) =>
        message.id === optimisticId ? saved : message,
      ),
    })),
  };
}
