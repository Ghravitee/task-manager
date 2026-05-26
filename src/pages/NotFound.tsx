// src/pages/NotFound.tsx
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center">
      <p className="text-6xl font-bold text-cyan-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={handleBack}
        className="mt-8 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-medium text-gray-950 transition hover:bg-cyan-400"
      >
        Go back
      </button>
    </div>
  );
}
