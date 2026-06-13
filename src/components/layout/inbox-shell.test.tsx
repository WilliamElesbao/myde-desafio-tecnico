import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConnectionStatusProvider } from "@/contexts/connection-status-context";
import { InboxShell } from "./inbox-shell";

// vi.hoisted: vi.mock is hoisted to the top, so the mock needs to exist beforehand
const { useParamsMock } = vi.hoisted(() => ({
  useParamsMock: vi.fn<() => { conversationId?: string }>(() => ({})),
}));

vi.mock("next/navigation", () => ({
  useParams: useParamsMock,
}));

function renderShell() {
  return render(
    <ConnectionStatusProvider>
      <InboxShell sidebar={<div>SIDEBAR</div>}>
        <div>CHAT</div>
      </InboxShell>
    </ConnectionStatusProvider>,
  );
}

describe("InboxShell", () => {
  beforeEach(() => {
    useParamsMock.mockReturnValue({});
  });

  it("renderiza sidebar e conteúdo", () => {
    renderShell();
    expect(screen.getByText("SIDEBAR")).toBeInTheDocument();
    expect(screen.getByText("CHAT")).toBeInTheDocument();
  });

  it("sem conversa na URL: lista visível e chat escondido no mobile", () => {
    renderShell();
    expect(screen.getByRole("main")).toHaveClass("hidden");
    expect(
      screen.getByRole("complementary", { name: "Conversas" }),
    ).toHaveClass("flex");
  });

  it("com conversa na URL: chat visível e lista escondida no mobile", () => {
    useParamsMock.mockReturnValue({ conversationId: "c-1" });
    renderShell();
    expect(
      screen.getByRole("complementary", { name: "Conversas" }),
    ).toHaveClass("hidden");
    expect(screen.getByRole("main")).toHaveClass("flex");
  });
});
