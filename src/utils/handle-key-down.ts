import type { KeyboardEvent } from "react";

// Chat convention: Enter sends, Shift+Enter breaks the line
export function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }
}
