import { expect, test } from "@playwright/test";
import { mockApi } from "./support/mock-api";

test.describe("Inbox — lista de conversas", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await page.goto("/");
  });

  test("mostra as conversas com última mensagem e não-lidas", async ({
    page,
  }) => {
    await expect(page.getByText("Mariana Lopes")).toBeVisible();
    await expect(
      page.getByText("Minha internet caiu de novo agora de manhã"),
    ).toBeVisible();
    // unread badge
    await expect(page.getByLabel("2 não lidas")).toBeVisible();
  });

  test("busca filtra por nome", async ({ page }) => {
    await expect(page.getByText("Mariana Lopes")).toBeVisible();

    await page
      .getByRole("searchbox", { name: "Buscar conversa por nome ou telefone" })
      .fill("rafael");

    await expect(page.getByText("Rafael Augusto")).toBeVisible();
    await expect(page.getByText("Mariana Lopes")).toBeHidden();
  });

  test("busca sem resultado mostra estado vazio", async ({ page }) => {
    await page
      .getByRole("searchbox", { name: "Buscar conversa por nome ou telefone" })
      .fill("inexistente");

    await expect(page.getByText("Nenhum resultado")).toBeVisible();
  });

  test("abrir uma conversa navega para a tela de chat", async ({ page }) => {
    await page.getByRole("link", { name: /Mariana Lopes/ }).click();

    await expect(page).toHaveURL(/\/conversations\/c-1001/);
    const chat = page.getByRole("main");
    await expect(
      chat.getByRole("heading", { name: "Mariana Lopes" }),
    ).toBeVisible();
    await expect(chat.getByText("Bom dia")).toBeVisible();
  });
});
