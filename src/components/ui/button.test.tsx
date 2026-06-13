import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renderiza e dispara onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enviar</Button>);

    await user.click(screen.getByRole("button", { name: "Enviar" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("tem type=button por padrão", () => {
    render(<Button>Ok</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("não dispara onClick quando disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Enviar
      </Button>,
    );

    await user.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renderiza como filho com asChild", () => {
    render(
      <Button asChild>
        <a href="/x">Link</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Link" })).toBeInTheDocument();
  });
});
