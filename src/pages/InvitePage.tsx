import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAcceptInvite } from "../features/workspaces/hooks/useAcceptInvite";
import { useAuth } from "../context/AuthContext";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { isAuthenticated, isAuthInitialized } = useAuth();
  const navigate = useNavigate();
  const { mutate: acceptInvite, isError, error } = useAcceptInvite();

  useEffect(() => {
    if (!isAuthInitialized) return;

    // Not logged in — redirect to login, then come back
    if (!isAuthenticated) {
      navigate(`/login?redirect=/invite/${token}`, { replace: true });
      return;
    }

    // Authenticated — accept the invite
    acceptInvite(token!, {
      onSuccess: (workspaceId) => {
        navigate(`/workspace/${workspaceId}`, { replace: true });
      },
    });
  }, [isAuthInitialized, isAuthenticated, acceptInvite, navigate, token]);

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-950">
        <p className="text-lg font-semibold text-white">Invalid invite</p>
        <p className="text-sm text-gray-400">
          {error instanceof Error
            ? error.message
            : "This invite link is invalid or has expired."}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-2 text-sm text-cyan-400 hover:text-cyan-300"
        >
          Go to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-950">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      <p className="text-sm text-gray-400">Joining workspace...</p>
    </div>
  );
}
