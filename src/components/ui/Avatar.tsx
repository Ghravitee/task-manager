import { cn } from "../../utils/cn";
import { getInitials } from "../../utils/format";

// ─── Types ────────────────────────────────────────────────────

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: AvatarSize;
  className?: string;
}

// ─── Styles ───────────────────────────────────────────────────

const sizeStyles: Record<AvatarSize, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-xl",
};

// ─── Component ────────────────────────────────────────────────

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "User avatar"}
        className={cn(
          "rounded-full object-cover ring-2 ring-white/10",
          sizeStyles[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        "bg-cyan-500/20 text-cyan-300 ring-2 ring-white/10",
        "font-semibold",
        sizeStyles[size],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
