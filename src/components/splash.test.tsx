import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Splash } from "./splash";

const cookieGet = vi.hoisted(() => vi.fn());
vi.mock("next/headers", () => ({
  cookies: () => Promise.resolve({ get: cookieGet }),
}));

// Render only a marker for the client splash — its animation/timers are
// covered in splash.client.test.tsx.
vi.mock("./splash.client", () => ({
  SplashClient: () => <div data-testid="splash-client" />,
}));

describe("Splash (server gate)", () => {
  it("renderiza a splash quando o cookie não existe (primeira visita)", async () => {
    cookieGet.mockReturnValue(undefined);

    render(await Splash());

    expect(screen.getByTestId("splash-client")).toBeInTheDocument();
  });

  it("omite a splash quando o cookie já está marcado (visita repetida)", async () => {
    cookieGet.mockReturnValue({ value: "true" });

    const result = await Splash();

    expect(result).toBeNull();
  });
});
