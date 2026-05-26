import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/useToast";
import { transferOwnership } from "../service";
import { WORKSPACES_KEY } from "./useWorkspaces";

export function useTransferOwnership(workspaceId: string) {
  const queryClient = useQueryClient();
  const { success: toastSuccess, error: toastError } = useToast();

  return useMutation({
    mutationFn: (newOwnerId: string) =>
      transferOwnership(workspaceId, newOwnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKSPACES_KEY });
      toastSuccess("Ownership transferred.");
    },
    onError: (err: Error) => {
      toastError(err.message ?? "Failed to transfer ownership.");
    },
  });
}
