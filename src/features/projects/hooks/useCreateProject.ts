import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { createProject } from "../service";

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: (input: { name: string; description?: string }) =>
      createProject(workspaceId, profile!.id, input),

    onSuccess: () => {
      // Invalidate this workspace's project list — triggers a fresh fetch
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}
