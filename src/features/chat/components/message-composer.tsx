"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  type ComposerFormValues,
  composerFormSchema,
} from "../schemas/composer-form";
import { AiSuggestButton } from "./ai-suggest-button";
import { ComposerForm } from "./message-form";

type MessageComposerProps = {
  conversationId: string;
};

function MessageComposer({ conversationId }: Readonly<MessageComposerProps>) {
  const form = useForm<ComposerFormValues>({
    resolver: zodResolver(composerFormSchema),
    defaultValues: { message: "" },
  });

  const { reset } = form;
  // biome-ignore lint/correctness/useExhaustiveDependencies: the unsent draft must be discarded exactly when the conversation changes
  useEffect(() => {
    reset({ message: "" });
  }, [conversationId, reset]);

  return (
    <FormProvider {...form}>
      <div className="border-t border-line bg-surface-muted px-4 py-3">
        <div className="mb-2">
          <AiSuggestButton conversationId={conversationId} />
        </div>
        <ComposerForm conversationId={conversationId} />
      </div>
    </FormProvider>
  );
}

export { MessageComposer };
