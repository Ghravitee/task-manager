import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRouteLoadingContext } from "../context/RouteLoadingContext";

export function useNavigation() {
  const navigate = useNavigate();
  const { startLoading } = useRouteLoadingContext();

  const navigateTo = useCallback(
    (path: string | number, state?: Record<string, unknown>) => {
      startLoading();
      if (typeof path === "number") {
        navigate(path);
      } else {
        navigate(path, { state });
      }
    },
    [navigate, startLoading],
  );

  return { navigateTo };
}
