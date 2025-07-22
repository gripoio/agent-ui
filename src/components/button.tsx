import React from "react";

type ChatUIButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "default" | "custom";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ChatUIButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  variant = "default",
  ...props
}: ChatUIButtonProps) {
  const baseStyles = variant === "default" 
    ? `tw-inline-flex tw-items-center tw-justify-center tw-gap-2
       tw-px-4 tw-py-2 tw-rounded-md tw-text-sm tw-font-medium
       tw-bg-blue-600 tw-text-white hover:tw-bg-blue-700 disabled:tw-opacity-50
       focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2
       dark:tw-bg-blue-500 dark:hover:tw-bg-blue-600 dark:focus:tw-ring-blue-400`
    : `tw-inline-flex tw-items-center tw-justify-center
       focus:tw-outline-none disabled:tw-opacity-50`;

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...props}
      className={`${baseStyles} ${className}`}
    >
      {children}
    </button>
  );
}