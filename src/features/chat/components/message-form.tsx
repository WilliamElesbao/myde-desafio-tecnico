"use client";

import { SendHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";
import { handleKeyDown } from "@/utils/handle-key-down";
import { useSendMessage } from "../hooks/use-send-message";
import type { ComposerFormValues } from "../schemas/composer-form";

type ComposerFormProps = {
  conversationId: string;
};

function ComposerForm({ conversationId }: Readonly<ComposerFormProps>) {
  const { control, register, handleSubmit, setValue, getValues } =
    useFormContext<ComposerFormValues>();
  const message = useWatch({ control, name: "message" });
  const sendMessage = useSendMessage(conversationId);
  const textareaRef = useAutosizeTextarea(message);

  const { reset: resetSendState } = sendMessage;
  const activeConversationIdRef = useRef(conversationId);
  useEffect(() => {
    activeConversationIdRef.current = conversationId;
    resetSendState();
  }, [conversationId, resetSendState]);

  const onSubmit = handleSubmit(({ message: text }) => {
    setValue("message", "");
    sendMessage.mutate(text, {
      // Give the text back so the user can retry — only if they are still on
      // the same conversation and have not started another draft meanwhile
      onError: () => {
        if (activeConversationIdRef.current !== conversationId) return;
        if (getValues("message") === "") setValue("message", text);
      },
    });
  });

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
          className="max-h-40 resize-none overflow-y-auto bg-surface"
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

      <p aria-live="polite" className="mt-1 min-h-4 text-xs text-danger">
        {sendMessage.isError
          ? "Não foi possível enviar a mensagem. Tente novamente."
          : ""}
      </p>
    </>
  );
}

export { ComposerForm };
