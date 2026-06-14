import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NeoFibraLogo } from "./neofibra-logo";

describe("NeoFibraLogo", () => {
  it("é acessível com rótulo quando recebe title", () => {
    render(<NeoFibraLogo title="NeoFibra" />);
    const logo = screen.getByRole("img", { name: "NeoFibra" });
    expect(logo).toBeInTheDocument();
    expect(logo).not.toHaveAttribute("aria-hidden", "true");
  });

  it("é decorativo (aria-hidden, sem role) quando title é vazio", () => {
    const { container } = render(<NeoFibraLogo title="" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
