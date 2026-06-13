import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConversationSearch } from "./conversation-search";

describe("ConversationSearch", () => {
  it("renderiza com label acessível", () => {
    render(<ConversationSearch value="" onChange={() => {}} />);
    expect(
      screen.getByRole("searchbox", {
        name: "Buscar conversa por nome ou telefone",
      }),
    ).toBeInTheDocument();
  });

  it("propaga a digitação via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ConversationSearch value="" onChange={onChange} />);

    await user.type(screen.getByRole("searchbox"), "ma");
    expect(onChange).toHaveBeenCalledWith("m");
    expect(onChange).toHaveBeenCalledWith("a");
  });
});
