import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateDailyOrderNumber(existingNumbers: string[] = []): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const datePart = (type: string) => parts.find((part) => part.type === type)?.value;
  const today = `${datePart("year")}${datePart("month")}${datePart("day")}`;
  const prefix = `#A${today}-`;
  const largest = existingNumbers.reduce((max, number) => {
    if (!number.startsWith(prefix)) return max;
    const sequence = Number(number.slice(prefix.length));
    return Number.isInteger(sequence) && sequence > max ? sequence : max;
  }, 0);
  return `${prefix}${String(largest + 1).padStart(3, "0")}`;
}
