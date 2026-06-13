import { describe, expect, it } from "vitest";
import { getQueryClient, makeQueryClient } from "./query-client";

describe("makeQueryClient", () => {
  it("cria clients independentes", () => {
    expect(makeQueryClient()).not.toBe(makeQueryClient());
  });

  it("configura staleTime padrão para cobrir a hidratação SSR", () => {
    const client = makeQueryClient();
    expect(client.getDefaultOptions().queries?.staleTime).toBeGreaterThan(0);
  });
});

describe("getQueryClient", () => {
  it("reutiliza o singleton no browser (jsdom)", () => {
    expect(getQueryClient()).toBe(getQueryClient());
  });
});
