import { useToastContext } from "../context/ToastContext";
import type { Toast } from "../context/ToastContext";

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastContext();

  const styles = {
    success: {
      container: "border-emerald-500/30 bg-emerald-500/10",
      text: "text-emerald-300",
      icon: "✓",
    },
    error: {
      container: "border-red-500/30 bg-red-500/10",
      text: "text-red-300",
      icon: "✕",
    },
    info: {
      container: "border-cyan-500/30 bg-cyan-500/10",
      text: "text-cyan-300",
      icon: "ℹ",
    },
  };

  const style = styles[toast.type];

  return (
    <div
      className={`
        flex items-start gap-3 rounded-lg border px-4 py-3
        shadow-lg backdrop-blur-sm
        ${style.container}
      `}
    >
      <span className={`mt-0.5 text-sm font-bold ${style.text}`}>
        {style.icon}
      </span>
      <p className={`flex-1 text-sm ${style.text}`}>{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className={`text-sm opacity-50 transition hover:opacity-100 ${style.text}`}
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex w-80 flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
