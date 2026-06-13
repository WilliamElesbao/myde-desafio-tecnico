import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "./use-debounced-value";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retorna o valor inicial imediatamente", () => {
    const { result } = renderHook(() => useDebouncedValue("a", 200));
    expect(result.current).toBe("a");
  });

  it("só atualiza após o delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("ab");
  });

  it("reinicia o timer a cada mudança", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "ab" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    rerender({ value: "abc" });
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe("abc");
  });
});
