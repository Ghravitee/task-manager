import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvite } from "../service";
import { useAuth } from "../../../context/AuthContext";

export function useCreateInvite(workspaceId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: () => createInvite(workspaceId, user?.id ?? ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites", workspaceId] });
    },
  });
}
