import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/useToast";
import { deleteWorkspace } from "../service";
import { WORKSPACES_KEY } from "./useWorkspaces";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  return useMutation({
    mutationFn: (workspaceId: string) => deleteWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      toastSuccess("Workspace deleted.");
    },
    onError: (err: Error) => {
      toastError(err.message ?? "Failed to delete workspace.");
    },
  });
}
