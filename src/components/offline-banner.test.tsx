import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConnectionStatusProvider } from "@/contexts/connection-status-context";
import { OfflineBanner } from "./offline-banner";

describe("OfflineBanner", () => {
  it("não aparece quando online", () => {
    render(
      <ConnectionStatusProvider>
        <OfflineBanner />
      </ConnectionStatusProvider>,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("aparece quando offline", () => {
    render(
      <ConnectionStatusProvider>
        <OfflineBanner />
      </ConnectionStatusProvider>,
    );

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByRole("status")).toHaveTextContent(/offline/i);
  });
});
