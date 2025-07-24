type TextVariant =
  | "display"
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "small"
  | "caption"
  | "helper"
  | "error";

export function getTextStyle(variant: TextVariant): string {
  const styles: Record<TextVariant, string> = {
    display: "tw-text-5xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100",
    heading1: "tw-text-3xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100",
    heading2: "tw-text-2xl tw-font-semibold tw-text-gray-800 dark:tw-text-gray-200",
    heading3: "tw-text-xl tw-font-medium tw-text-gray-800 dark:tw-text-gray-200",
    paragraph: "tw-text-base tw-font-normal tw-text-gray-700 dark:tw-text-gray-300",
    small: "tw-text-sm tw-font-normal tw-text-gray-600 dark:tw-text-gray-400",
    caption: "tw-text-xs tw-font-medium tw-text-gray-500 dark:tw-text-gray-400",
    helper: "tw-text-xs tw-font-normal tw-text-gray-400 dark:tw-text-gray-500",
    error: "tw-text-xs tw-font-medium tw-text-red-500 dark:tw-text-red-400",
  };

  return styles[variant];
}
