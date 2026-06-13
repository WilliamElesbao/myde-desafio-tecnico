import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renderiza título e descrição", () => {
    render(
      <EmptyState
        icon={Inbox}
        title="Nada por aqui"
        description="Nenhuma conversa encontrada"
      />,
    );

    expect(screen.getByText("Nada por aqui")).toBeInTheDocument();
    expect(screen.getByText("Nenhuma conversa encontrada")).toBeInTheDocument();
  });

  it("renderiza ação opcional", () => {
    render(
      <EmptyState
        title="Vazio"
        action={<button type="button">Recarregar</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Recarregar" }),
    ).toBeInTheDocument();
  });
});
