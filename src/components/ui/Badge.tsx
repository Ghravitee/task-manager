import { cn } from "../../utils/cn";
import type { TaskStatus, TaskPriority, WorkspaceRole } from "../../types";

// ─── Types ────────────────────────────────────────────────────

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | TaskStatus
  | TaskPriority
  | WorkspaceRole;

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────

const variantStyles: Record<string, string> = {
  // Generic variants
  default: "border-white/10 bg-white/5 text-gray-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  danger: "border-red-500/30 bg-red-500/10 text-red-300",
  info: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",

  // Task status
  todo: "border-gray-500/30 bg-gray-500/10 text-gray-300",
  in_progress: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  done: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",

  // Task priority
  low: "border-gray-500/30 bg-gray-500/10 text-gray-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  urgent: "border-red-500/30 bg-red-500/10 text-red-300",

  // Workspace roles
  owner: "border-purple-500/30 bg-purple-500/10 text-purple-300",
  admin: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  member: "border-gray-500/30 bg-gray-500/10 text-gray-300",
};

// ─── Component ────────────────────────────────────────────────

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant] ?? variantStyles.default,
        className,
      )}
    >
      {children}
    </span>
  );
}
