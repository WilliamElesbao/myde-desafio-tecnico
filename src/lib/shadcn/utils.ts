import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combines classes conditionally and resolves conflicts in Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
