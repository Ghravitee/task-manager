import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/useToast";
import { leaveWorkspace } from "../service";
import { WORKSPACES_KEY } from "./useWorkspaces";

export function useLeaveWorkspace() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  return useMutation({
    mutationFn: (workspaceId: string) => leaveWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      toastSuccess("You have left the workspace.");
    },
    onError: (err: Error) => {
      toastError(err.message ?? "Failed to leave workspace.");
    },
  });
}
