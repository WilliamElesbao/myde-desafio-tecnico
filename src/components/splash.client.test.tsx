import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SplashClient } from "./splash.client";

const markSplashSeenAction = vi.hoisted(() => vi.fn());
vi.mock("@/actions/splash/mark-splash-seen.action", () => ({
  markSplashSeenAction,
}));

const HOLD_MS = 1600;
const FADE_MS = 600;

describe("SplashClient", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("aparece visível, faz fade, desmonta e persiste que foi vista", () => {
    render(<SplashClient />);

    const splash = screen.getByRole("status", { name: "Carregando NeoFibra" });
    expect(splash).toHaveClass("opacity-100");

    // after HOLD_MS, the fade-out starts
    act(() => {
      vi.advanceTimersByTime(HOLD_MS);
    });
    expect(
      screen.getByRole("status", { name: "Carregando NeoFibra" }),
    ).toHaveClass("opacity-0");
    expect(markSplashSeenAction).not.toHaveBeenCalled();

    // after FADE_MS, the component should be unmounted
    act(() => {
      vi.advanceTimersByTime(FADE_MS);
    });
    expect(
      screen.queryByRole("status", { name: "Carregando NeoFibra" }),
    ).not.toBeInTheDocument();
    expect(markSplashSeenAction).toHaveBeenCalledTimes(1);
  });
});
