// components/ui/BackButton.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to: string;
  label?: string;
}

export function BackButton({ to, label = "Back" }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center gap-1.5 text-sm text-gray-400 
                 hover:text-white transition-colors mb-6"
    >
      <ArrowLeft size={15} />
      {label}
    </button>
  );
}
