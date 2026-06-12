import { dayjs } from "@/lib/dayjs/dayjs";

/**
 * Formats a date to a short time format: "14:32".
 * @param isoDate - The ISO date string to format.
 */
export function formatMessageTime(isoDate: string): string {
  return dayjs(isoDate).format("HH:mm");
}

/**
 * Conversation list timestamp, in WhatsApp style:
 * today → "14:32" | yesterday → "Yesterday" | same week → "Monday" | older → "11/06/2026".
 * @param isoDate - The ISO date string to format.
 */
export function formatConversationTime(isoDate: string): string {
  const date = dayjs(isoDate);
  if (date.isToday()) return date.format("HH:mm");
  if (date.isYesterday()) return "Ontem";
  if (date.isAfter(dayjs().subtract(7, "day"))) return date.format("dddd");
  return date.format("DD/MM/YYYY");
}
