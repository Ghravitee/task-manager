import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { Button } from "./ui/Button";

export function RouteError() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 text-center">
      <span className="text-6xl">💥</span>
      <h1 className="mt-6 text-2xl font-bold text-white">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-gray-400">
        The app ran into an unexpected error.
      </p>

      {import.meta.env.DEV && (
        <pre className="mt-6 max-w-lg overflow-auto rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-left text-xs text-red-300">
          {message}
        </pre>
      )}

      <div className="mt-8 flex gap-3">
        <Button onClick={() => window.location.reload()}>Reload page</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go home
        </Button>
      </div>
    </div>
  );
}
