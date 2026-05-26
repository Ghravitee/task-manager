import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../service";

export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => fetchProjects(workspaceId),
    enabled: !!workspaceId,
  });
}
