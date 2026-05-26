import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/useToast";
import { renameWorkspace } from "../service";
import { WORKSPACES_KEY } from "./useWorkspaces";

export function useRenameWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  return useMutation({
    mutationFn: (name: string) => renameWorkspace(workspaceId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      toastSuccess("Workspace renamed.");
    },
    onError: (err: Error) => {
      toastError(err.message ?? "Failed to rename workspace.");
    },
  });
}
