import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRouteLoadingContext } from "../context/RouteLoadingContext";

export function useRouteLoading() {
  const location = useLocation();
  const { isLoading, stopLoading } = useRouteLoadingContext();

  useEffect(() => {
    stopLoading();
  }, [location.pathname, stopLoading]);

  return isLoading;
}
