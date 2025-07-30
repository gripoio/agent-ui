import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names conditionally and merges Tailwind classes intelligently.
 *
 * @param inputs - Any number of class values, including strings, arrays, objects
 * @returns A single merged className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
