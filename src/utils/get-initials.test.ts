import { describe, expect, it } from "vitest";
import { getInitials } from "./get-initials";

describe("getInitials", () => {
  it("usa primeira letra do primeiro e do último nome", () => {
    expect(getInitials("Mariana Lopes")).toBe("ML");
    expect(getInitials("Pedro Henrique da Silva")).toBe("PS");
  });

  it("usa uma letra para nome único", () => {
    expect(getInitials("Ana")).toBe("A");
  });

  it("retorna ? para string vazia ou espaços", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials("   ")).toBe("?");
  });
});
