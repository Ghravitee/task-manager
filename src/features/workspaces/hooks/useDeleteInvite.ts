import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInvite } from "../service";

export function useDeleteInvite(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => deleteInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites", workspaceId] });
    },
  });
}
