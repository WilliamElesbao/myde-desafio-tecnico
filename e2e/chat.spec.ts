import { expect, test } from "@playwright/test";
import { mockApi } from "./support/mock-api";

// The same text appears in the chat bubble AND as "last message" in the
// sidebar — selectors are scoped to the right panel to avoid strict mode
// violations.
test.describe("Chat — mensagens, envio otimista e IA", () => {
  test("mostra o histórico em bolhas com timestamps", async ({ page }) => {
    await mockApi(page);
    await page.goto("/conversations/c-1001");

    const chat = page.getByRole("main");
    await expect(chat.getByText("Bom dia")).toBeVisible();
    await expect(
      chat.getByText("Minha internet caiu de novo agora de manhã"),
    ).toBeVisible();
    // received bubbles have an accessible label
    await expect(
      chat.getByRole("listitem", { name: "Mensagem recebida" }).first(),
    ).toBeVisible();
  });

  test("envio otimista: a mensagem aparece antes da confirmação", async ({
    page,
  }) => {
    // delays the POST so the "Enviando" state is observable
    await mockApi(page, { sendDelayMs: 1500 });
    await page.goto("/conversations/c-1001");

    const chat = page.getByRole("main");
    await expect(chat.getByText("Bom dia")).toBeVisible();

    await chat
      .getByRole("textbox", { name: "Mensagem" })
      .fill("Vou verificar sua conexão agora mesmo");
    await chat.getByRole("button", { name: "Enviar" }).click();

    // visible immediately, with sending status (before the server responds)
    await expect(
      chat.getByText("Vou verificar sua conexão agora mesmo"),
    ).toBeVisible();
    await expect(chat.getByText("Enviando")).toBeVisible();

    // after confirmation the sending status disappears and the message remains
    await expect(chat.getByText("Enviando")).toBeHidden({ timeout: 5000 });
    await expect(
      chat.getByText("Vou verificar sua conexão agora mesmo"),
    ).toBeVisible();
  });

  test("sugestão com IA preenche o campo de mensagem", async ({ page }) => {
    await mockApi(page);
    await page.goto("/conversations/c-1001");

    const chat = page.getByRole("main");
    await expect(chat.getByText("Bom dia")).toBeVisible();

    await chat.getByRole("button", { name: "Sugerir resposta com IA" }).click();

    await expect(chat.getByRole("textbox", { name: "Mensagem" })).toHaveValue(
      "Lamento pelo transtorno! Já estou verificando sua conexão.",
    );
  });

  test("rascunho não enviado é limpo ao trocar de conversa", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile",
      "fluxo desktop (duas colunas)",
    );

    await mockApi(page);
    await page.goto("/conversations/c-1001");

    const chat = page.getByRole("main");
    await expect(chat.getByText("Bom dia")).toBeVisible();

    await chat
      .getByRole("textbox", { name: "Mensagem" })
      .fill("rascunho não enviado");

    // switching conversation through the sidebar → input cleared
    await page.getByRole("link", { name: /Rafael Augusto/ }).click();
    await expect(page).toHaveURL(/\/conversations\/c-1002/);
    await expect(chat.getByRole("textbox", { name: "Mensagem" })).toHaveValue(
      "",
    );
  });

  test("mobile: chat abre em tela cheia com botão de voltar", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "apenas no projeto mobile");

    await mockApi(page);
    await page.goto("/conversations/c-1001");

    await page
      .getByRole("link", { name: "Voltar para a lista de conversas" })
      .click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Mariana Lopes")).toBeVisible();
  });
});
