import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

// ─── Types ────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, leftIcon, rightIcon, className, id, ...props },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 text-gray-500">{leftIcon}</div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border bg-gray-800 text-sm text-white",
              "placeholder-gray-500 outline-none transition-colors",
              "border-white/10 focus:border-cyan-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500/50 focus:border-red-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              "px-4 py-2.5",
              className,
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-3 text-gray-500">{rightIcon}</div>
          )}
        </div>

        {/* Error message */}
        {error && <p className="text-xs text-red-400">{error}</p>}

        {/* Hint text */}
        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
