import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/lib/http/api";
import type { ComposerFormValues } from "../schemas/composer-form";
import { AiSuggestButton } from "./ai-suggest-button";

vi.mock("@/lib/http/api", async (importOriginal) => ({
  ...(await importOriginal<typeof api>()),
  suggestReply: vi.fn(),
}));

/** Exposes the form value the button writes into, like the real composer. */
function MessageProbe() {
  const { control } = useFormContext<ComposerFormValues>();
  const message = useWatch({ control, name: "message" });
  return <output aria-label="rascunho">{message}</output>;
}

function Harness({ conversationId }: Readonly<{ conversationId: string }>) {
  const form = useForm<ComposerFormValues>({
    defaultValues: { message: "" },
  });
  return (
    <FormProvider {...form}>
      <AiSuggestButton conversationId={conversationId} />
      <MessageProbe />
    </FormProvider>
  );
}

function renderButton(conversationId = "c-1") {
  const queryClient = new QueryClient();
  const view = render(
    <QueryClientProvider client={queryClient}>
      <Harness conversationId={conversationId} />
    </QueryClientProvider>,
  );
  const rerenderButton = (nextConversationId: string) =>
    view.rerender(
      <QueryClientProvider client={queryClient}>
        <Harness conversationId={nextConversationId} />
      </QueryClientProvider>,
    );
  return { ...view, rerenderButton };
}

describe("AiSuggestButton", () => {
  it("preenche o composer com a sugestão da IA", async () => {
    const user = userEvent.setup();
    vi.mocked(api.suggestReply).mockResolvedValue({
      suggestion: "Posso verificar isso para você!",
      source: "mock",
    });

    renderButton();
    await user.click(
      screen.getByRole("button", { name: "Sugerir resposta com IA" }),
    );

    expect(
      await screen.findByText("Posso verificar isso para você!"),
    ).toBeInTheDocument();
    expect(api.suggestReply).toHaveBeenCalledWith("c-1");
  });

  it("mostra estado de loading enquanto gera", async () => {
    const user = userEvent.setup();
    vi.mocked(api.suggestReply).mockReturnValue(new Promise(() => {}));

    renderButton();
    await user.click(
      screen.getByRole("button", { name: "Sugerir resposta com IA" }),
    );

    expect(screen.getByText("Gerando…")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("mostra erro quando a sugestão falha", async () => {
    const user = userEvent.setup();
    vi.mocked(api.suggestReply).mockRejectedValue(new Error("boom"));

    renderButton();
    await user.click(
      screen.getByRole("button", { name: "Sugerir resposta com IA" }),
    );

    expect(
      await screen.findByText("Não foi possível gerar a sugestão."),
    ).toBeInTheDocument();
  });

  it("descarta sugestão que chega após trocar de conversa", async () => {
    const user = userEvent.setup();
    let resolveSuggestion: (value: api.AiSuggestion) => void = () => {};
    vi.mocked(api.suggestReply).mockReturnValue(
      new Promise((resolve) => {
        resolveSuggestion = resolve;
      }),
    );

    const { rerenderButton } = renderButton("c-1");
    await user.click(
      screen.getByRole("button", { name: "Sugerir resposta com IA" }),
    );

    // the user switches conversation while the suggestion is in flight
    rerenderButton("c-2");
    resolveSuggestion({ suggestion: "resposta atrasada", source: "mock" });

    // the late suggestion must not leak into the other conversation's draft
    await expect(
      screen.findByText("resposta atrasada", undefined, { timeout: 300 }),
    ).rejects.toThrow();
    expect(screen.getByLabelText("rascunho")).toHaveTextContent("");
  });
});
