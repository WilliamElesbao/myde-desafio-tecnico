import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConversationListSkeleton } from "./conversation-list-skeleton";

describe("ConversationListSkeleton", () => {
  it("anuncia carregamento para leitores de tela", () => {
    render(<ConversationListSkeleton />);
    const status = screen.getByRole("status", { name: "Carregando conversas" });
    expect(status).toHaveAttribute("aria-busy", "true");
  });
});
