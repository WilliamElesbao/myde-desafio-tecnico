"use client";

import { type RefObject, useLayoutEffect, useRef } from "react";

/**
 * Auto-grows a textarea to fit its content on every `value` change, up to
 * the element's CSS max-height; beyond that the box scrolls internally.
 * Layout effect so the measurement happens before paint.
 */
export function useAutosizeTextarea(
  value: string,
): RefObject<HTMLTextAreaElement | null> {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the measurement must re-run on every value change even though the content is read from the DOM
  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const borders = textarea.offsetHeight - textarea.clientHeight;
    textarea.style.height = `${textarea.scrollHeight + borders}px`;
  }, [value]);

  return textareaRef;
}
