import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "./error-state";

describe("ErrorState", () => {
  it("renderiza com role=alert e textos padrão", () => {
    render(<ErrorState />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Algo deu errado")).toBeInTheDocument();
  });

  it("chama onRetry ao clicar em tentar novamente", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("não mostra botão sem onRetry", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
