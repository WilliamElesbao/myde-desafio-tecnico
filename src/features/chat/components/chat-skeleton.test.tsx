import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatSkeleton } from "./chat-skeleton";

describe("ChatSkeleton", () => {
  it("anuncia carregamento para leitores de tela", () => {
    render(<ChatSkeleton />);
    expect(
      screen.getByRole("status", { name: "Carregando mensagens" }),
    ).toHaveAttribute("aria-busy", "true");
  });
});
