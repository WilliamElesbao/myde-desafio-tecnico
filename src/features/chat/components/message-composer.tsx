"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { ComposerFormValues } from "../types";
import { AiSuggestButton } from "./ai-suggest-button";
import { ComposerForm } from "./message-form";

type MessageComposerProps = {
  conversationId: string;
};

function MessageComposer({ conversationId }: Readonly<MessageComposerProps>) {
  const form = useForm<ComposerFormValues>({
    defaultValues: { message: "" },
  });

  useEffect(() => {
    form.reset({ message: "" });
  }, [form.reset]);

  return (
    <FormProvider {...form}>
      <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3">
        <div className="mb-2">
          <AiSuggestButton conversationId={conversationId} />
        </div>
        <ComposerForm conversationId={conversationId} />
      </div>
    </FormProvider>
  );
}

export { MessageComposer };
