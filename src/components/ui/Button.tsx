import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

// ─── Types ────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

// ─── Styles ───────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-cyan-500 text-gray-900 hover:bg-cyan-400 disabled:bg-cyan-500/50",
  secondary: "bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-700/50",
  danger:
    "bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20",
  ghost: "bg-transparent text-gray-400 hover:bg-white/5 hover:text-white",
  outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-lg",
};

// ─── Component ────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles every button gets
          "inline-flex items-center justify-center gap-2",
          "font-semibold transition-colors duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Variant and size
          variantStyles[variant],
          sizeStyles[size],
          // Optional full width
          fullWidth && "w-full",
          // Allow overrides from outside
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Please wait...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
