import { SendHorizontal } from "lucide-react";
import { type KeyboardEvent, useEffect, useLayoutEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "../hooks/use-send-message";
import type { ComposerFormValues } from "../types";

type ComposerFormProps = {
  conversationId: string;
};

function ComposerForm({ conversationId }: Readonly<ComposerFormProps>) {
  const { control, register, handleSubmit, setValue, getValues } =
    useFormContext<ComposerFormValues>();
  const message = useWatch({ control, name: "message" });
  const sendMessage = useSendMessage(conversationId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-grow: the height follows the content (including when the field is
  // cleared or filled by the AI suggestion) up to the CSS max-h; beyond that
  // overflow-y scrolls the text inside the box. Layout effect so the
  // measurement happens before paint.
  // biome-ignore lint/correctness/useExhaustiveDependencies: the measurement must run on every draft change even though the value is read from the DOM
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const borders = textarea.offsetHeight - textarea.clientHeight;
    textarea.style.height = `${textarea.scrollHeight + borders}px`;
  }, [message]);

  const { reset: resetSendState } = sendMessage;
  const activeConversationIdRef = useRef(conversationId);
  useEffect(() => {
    activeConversationIdRef.current = conversationId;
    resetSendState();
  }, [conversationId, resetSendState]);

  const onSubmit = handleSubmit(({ message: rawMessage }) => {
    const text = rawMessage.trim();
    if (!text) return;

    setValue("message", "");

    sendMessage.mutate(text, {
      onError: () => {
        if (activeConversationIdRef.current !== conversationId) return;
        if (getValues("message") === "") setValue("message", text);
      },
    });
  });

  // Chat convention: Enter sends, Shift+Enter breaks the line
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  const { ref: registerTextarea, ...messageField } = register("message");

  return (
    <>
      <form
        onSubmit={onSubmit}
        aria-label="Enviar mensagem"
        className="flex items-end gap-2"
      >
        <Textarea
          {...messageField}
          ref={(element) => {
            registerTextarea(element);
            textareaRef.current = element;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem"
          aria-label="Mensagem"
          autoComplete="off"
          rows={1}
          className="max-h-40 resize-none overflow-y-auto bg-white"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Enviar"
          disabled={message.trim().length === 0}
        >
          <SendHorizontal aria-hidden="true" />
        </Button>
      </form>

      <p aria-live="polite" className="mt-1 min-h-4 text-xs text-red-600">
        {sendMessage.isError
          ? "Não foi possível enviar a mensagem. Tente novamente."
          : ""}
      </p>
    </>
  );
}

export { ComposerForm };
