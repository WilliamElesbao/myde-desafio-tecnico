import { z } from "zod";

/**
 * Composer validation: trims and rejects empty messages. Enter submits the
 * form even with an empty field — the resolver is what blocks the send.
 */
export const composerFormSchema = z.object({
  message: z.string().trim().min(1),
});

export type ComposerFormValues = z.infer<typeof composerFormSchema>;
