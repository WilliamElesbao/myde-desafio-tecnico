import { describe, expect, it } from "vitest";
import { OPTIMISTIC_MESSAGE_ID_PREFIX } from "../constants/pagination";
import { buildOptimisticMessage } from "./build-optimistic-message";

describe("buildOptimisticMessage", () => {
  it("cria mensagem de saída com status sending", () => {
    const message = buildOptimisticMessage("olá");

    expect(message.body).toBe("olá");
    expect(message.direction).toBe("out");
    expect(message.status).toBe("sending");
    expect(message.id.startsWith(OPTIMISTIC_MESSAGE_ID_PREFIX)).toBe(true);
  });

  it("gera ids únicos", () => {
    expect(buildOptimisticMessage("a").id).not.toBe(
      buildOptimisticMessage("a").id,
    );
  });
});
