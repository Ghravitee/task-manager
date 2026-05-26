import { useQuery } from "@tanstack/react-query";
import { fetchWorkspaceMembers } from "../service";

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => fetchWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
  });
}
