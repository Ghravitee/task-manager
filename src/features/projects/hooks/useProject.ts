import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "../service";

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });
}
