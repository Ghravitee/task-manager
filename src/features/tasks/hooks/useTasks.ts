import { useQuery } from "@tanstack/react-query";
import { type TaskFilters } from "../../../types";
import { fetchTasks } from "../service";

export function useTasks(projectId: string, filters?: TaskFilters) {
  return useQuery({
    queryKey: ["tasks", projectId, filters],
    queryFn: () => fetchTasks(projectId, filters),
    enabled: !!projectId,
  });
}
