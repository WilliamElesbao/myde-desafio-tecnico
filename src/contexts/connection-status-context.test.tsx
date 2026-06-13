import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ConnectionStatusProvider,
  useConnectionStatus,
} from "./connection-status-context";

function StatusProbe() {
  const { isOnline } = useConnectionStatus();
  return <span>{isOnline ? "online" : "offline"}</span>;
}

describe("ConnectionStatusProvider", () => {
  it("começa online (navigator.onLine = true no jsdom)", () => {
    render(
      <ConnectionStatusProvider>
        <StatusProbe />
      </ConnectionStatusProvider>,
    );
    expect(screen.getByText("online")).toBeInTheDocument();
  });

  it("reage aos eventos offline/online do browser", () => {
    render(
      <ConnectionStatusProvider>
        <StatusProbe />
      </ConnectionStatusProvider>,
    );

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByText("offline")).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    expect(screen.getByText("online")).toBeInTheDocument();
  });

  it("lança erro quando usado fora do provider", () => {
    expect(() => renderHook(() => useConnectionStatus())).toThrow(
      /dentro de ConnectionStatusProvider/,
    );
  });
});
