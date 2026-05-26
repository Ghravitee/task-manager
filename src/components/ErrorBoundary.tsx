import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error);
    console.error("Component stack:", info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 text-center">
          <span className="text-6xl">💥</span>
          <h1 className="mt-6 text-2xl font-bold text-white">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-md text-sm text-gray-400">
            The app ran into an unexpected error. This has been logged and we'll
            look into it.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-6 max-w-lg overflow-auto rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-left text-xs text-red-300">
              {this.state.error.message}
            </pre>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-cyan-400"
            >
              Reload page
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Go home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
