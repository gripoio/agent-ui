import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonVariants = cva(
  "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-md tw-text-sm tw-font-medium tw-ring-offset-background tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50",
  {
    variants: {
      variant: {
        default: "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90",
        destructive: "tw-bg-destructive tw-text-destructive-foreground hover:tw-bg-destructive/90",
        outline: "tw-border tw-border-input tw-bg-background hover:tw-bg-accent hover:tw-text-accent-foreground",
        secondary: "tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/80",
        ghost: "hover:tw-bg-accent hover:tw-text-accent-foreground",
        link: "tw-text-primary tw-underline-offset-4 hover:tw-underline",
        custom: "tw-inline-flex tw-items-center tw-justify-center focus:tw-outline-none disabled:tw-opacity-50"
      },
      size: {
        default: "tw-h-10 tw-px-4 tw-py-2",
        sm: "tw-h-9 tw-rounded-md tw-px-3",
        lg: "tw-h-11 tw-rounded-md tw-px-8",
        icon: "tw-h-10 tw-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ChatUIButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  asChild?: boolean;
}

export function ChatUIButton({
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
  variant,
  size,
  asChild = false,
  ...props
}: ChatUIButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}

// Alternative implementation without class-variance-authority if you prefer
export function ChatUIButtonSimple({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  variant = "default",
  size = "default",
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link" | "custom";
  size?: "default" | "sm" | "lg" | "icon";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  
  const baseStyles = "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-rounded-md tw-text-sm tw-font-medium tw-transition-colors focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-ring focus-visible:tw-ring-offset-2 disabled:tw-pointer-events-none disabled:tw-opacity-50";
  
  const variantStyles = {
    default: "tw-bg-primary tw-text-primary-foreground hover:tw-bg-primary/90",
    outline: "tw-border tw-border-input tw-bg-background hover:tw-bg-accent hover:tw-text-accent-foreground",
    ghost: "hover:tw-bg-accent hover:tw-text-accent-foreground",
    secondary: "tw-bg-secondary tw-text-secondary-foreground hover:tw-bg-secondary/80",
    destructive: "tw-bg-destructive tw-text-destructive-foreground hover:tw-bg-destructive/90",
    link: "tw-text-primary tw-underline-offset-4 hover:tw-underline",
    custom: ""
  };
  
  const sizeStyles = {
    default: "tw-h-10 tw-px-4 tw-py-2",
    sm: "tw-h-9 tw-rounded-md tw-px-3",
    lg: "tw-h-11 tw-rounded-md tw-px-8",
    icon: "tw-h-10 tw-w-10"
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
}