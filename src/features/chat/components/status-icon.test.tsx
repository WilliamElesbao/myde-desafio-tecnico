import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ChatMessage } from "../types";
import { StatusIcon } from "./status-icon";

// Each status maps to a decorative icon with a semantic color: outgoing
// states are subtle, "read" gets the blue tick, "failed" is danger.
const CASES: Array<{ status: ChatMessage["status"]; colorClass: string }> = [
  { status: "sending", colorClass: "text-subtle-foreground" },
  { status: "sent", colorClass: "text-subtle-foreground" },
  { status: "delivered", colorClass: "text-subtle-foreground" },
  { status: "read", colorClass: "text-read-tick" },
  { status: "failed", colorClass: "text-danger-soft" },
];

describe("StatusIcon", () => {
  it.each(
    CASES,
  )("renderiza ícone decorativo com cor semântica para '$status'", ({
    status,
    colorClass,
  }) => {
    const { container } = render(<StatusIcon status={status} />);
    const svg = container.querySelector("svg");

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass(colorClass);
  });

  it("usa o tick azul apenas no status 'read'", () => {
    const { container: read } = render(<StatusIcon status="read" />);
    const { container: delivered } = render(<StatusIcon status="delivered" />);

    expect(read.querySelector("svg")).toHaveClass("text-read-tick");
    expect(delivered.querySelector("svg")).not.toHaveClass("text-read-tick");
  });
});
