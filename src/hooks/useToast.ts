import { useCallback } from "react";
import { useToastContext } from "../context/ToastContext";

export function useToast() {
  const { addToast } = useToastContext();

  const success = useCallback(
    (message: string) => addToast(message, "success"),
    [addToast],
  );

  const error = useCallback(
    (message: string) => addToast(message, "error"),
    [addToast],
  );

  const info = useCallback(
    (message: string) => addToast(message, "info"),
    [addToast],
  );

  return { success, error, info };
}
