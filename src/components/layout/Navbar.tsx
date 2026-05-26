import type { ReactNode } from "react";

interface NavbarProps {
  title: string;
  actions?: ReactNode;
}

export function Navbar({ title, actions }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-gray-900/80 px-6 backdrop-blur-sm">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
}
