import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("mostra as iniciais do nome", () => {
    render(<Avatar name="Mariana Lopes" />);
    expect(screen.getByText("ML")).toBeInTheDocument();
  });

  it("aplica a cor do contato", () => {
    render(<Avatar name="Mariana Lopes" color="#25D366" />);
    expect(screen.getByText("ML")).toHaveStyle({
      backgroundColor: "#25D366",
    });
  });

  it("é decorativo (aria-hidden)", () => {
    render(<Avatar name="Mariana Lopes" />);
    expect(screen.getByText("ML")).toHaveAttribute("aria-hidden", "true");
  });
});
