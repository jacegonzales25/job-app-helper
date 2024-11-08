import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseDate = (date: Date) => {
  const parsedDate = new Date(date);
  return parsedDate ? parsedDate.toISOString() : new Date().toISOString();
};

