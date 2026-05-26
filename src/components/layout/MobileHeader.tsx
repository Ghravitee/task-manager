import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-gray-900 px-4 lg:hidden">
      <span className="font-bold text-white">TaskFlow</span>
      <button
        onClick={onMenuOpen}
        className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}
